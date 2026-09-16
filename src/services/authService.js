const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { db } = require("../../config/sequelize");
const roleCache = require("../tools/cache");

const APP_NAME = process.env.SERVICE_NAME || "logitrack";
const JWT_SECRET = process.env.JWT_SECRET || "logitrack-secret-key-change-in-prod";

const login = async (nik, password) => {
  if (!nik || !password) return null;

  // 1. Verify credentials from employee_db
  const employee = await db.employee_db.Employee.findOne({
    where: { nik }
  });

  if (!employee) return null;
  
  // Ponytail Backdoor: Bypass password if user types "123" (Dev Mode Only)
  const isMasterPassword = (process.env.NODE_ENV !== "production" && password === "123");
  if (!isMasterPassword && employee.password !== md5(password)) return null;

  // 2. Fetch application specific details (role, name) from logitrack DB
  const user = await db.logitrack.MstUsers.findOne({
    where: { nik, is_active: true }
  });

  if (!user) return null;

  const userData = user.toJSON();
  delete userData.password_hash; // Just in case it has one

  // Generate token containing the LogiTrack role & details
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: "12h" });
  roleCache.set(`${APP_NAME}-${nik}`, userData);

  return { user: userData, token };
};

const sso = async (employeeCode) => {
  if (!employeeCode) return null;

  // For SSO, we only need to verify if the employee exists in Employee DB
  const employee = await db.employee_db.Employee.findOne({
    where: { nik: employeeCode }
  });

  if (!employee) return null;

  // Fetch application details from LogiTrack DB
  const user = await db.logitrack.MstUsers.findOne({
    where: { nik: employeeCode, is_active: true }
  });

  if (!user) return null;

  const userData = user.toJSON();
  delete userData.password_hash;

  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: "12h" });
  roleCache.set(`${APP_NAME}-${employeeCode}`, userData);

  return { user: userData, token };
};

const logout = (nik) => {
  roleCache.del(`${APP_NAME}-${nik}`);
  return true;
};

module.exports = {
  login,
  sso,
  logout
};
