const { db } = require("../../config/sequelize");

const md5 = require("md5");

const getAll = async (filters = {}) => {
  if (!db.logitrack.MstUsers) return [];
  
  return await db.logitrack.MstUsers.findAll({ where: filters, raw: true });
};

const getById = async (id) => {
  return await db.logitrack.MstUsers.findByPk(id);
};

const getEmployees = async () => {
  // Fetch employees from employee_db
  const employees = await db.employee_db.Employee.findAll({
    attributes: ['nik', 'name', 'email', 'role', 'department_id'],
    raw: true
  });
  
  const empDepartments = await db.sequelizeEmployee.query('SELECT id, name FROM mst_departments', { type: db.Sequelize.QueryTypes.SELECT }).catch(() => []);
  
  const formattedEmployees = employees.map(emp => {
    const dept = empDepartments.find(d => d.id === emp.department_id);
    return {
      ...emp,
      department: dept ? dept.name : '',
      role: emp.role ? emp.role.toLowerCase() : 'admin'
    };
  });

  // Fetch already assigned NIKs in LogiTrack
  const assignedUsers = await db.logitrack.MstUsers.findAll({
    attributes: ['nik'],
    raw: true
  });
  const assignedNiks = assignedUsers.map(u => u.nik);

  // Return only employees who are not yet registered in LogiTrack
  return formattedEmployees.filter(emp => !assignedNiks.includes(emp.nik));
};



const create = async (data) => {
  // 1. STRICT: Employee MUST exist in employee_db
  let employee = await db.employee_db.Employee.findOne({ where: { nik: data.nik } });
  
  if (!employee) {
    throw new Error("Employee with this NIK does not exist in employee_db. Please register them in HR system first.");
  }

  // 2. Check if already exists in LogiTrack
  const existingUser = await db.logitrack.MstUsers.findOne({ where: { nik: data.nik } });
  if (existingUser) {
    throw new Error("User with this NIK is already registered in LogiTrack.");
  }

  // 3. Create in LogiTrack
  const logitrackUser = await db.logitrack.MstUsers.create({
    nik: data.nik,
    name: data.name,
    email: data.email,
    department: data.department,
    role: data.role || "admin",
    is_active: data.is_active !== undefined ? data.is_active : true,
    password_hash: "deprecated"
  });

  return logitrackUser;
};

const update = async (id, data) => {
  const user = await db.logitrack.MstUsers.findByPk(id);
  if (!user) return null;

  // Update employee_db if password or active status changed
  const employee = await db.employee_db.Employee.findOne({ where: { nik: user.nik } });
  if (employee) {
    if (data.password) {
      employee.password = md5(data.password);
    }
    await employee.save();
  }

  // Update Logitrack user
  await user.update({
    name: data.name !== undefined ? data.name : user.name,
    email: data.email !== undefined ? data.email : user.email,
    department: data.department !== undefined ? data.department : user.department,
    role: data.role !== undefined ? data.role : user.role,
    is_active: data.is_active !== undefined ? data.is_active : user.is_active
  });

  return user;
};

const remove = async (id) => {
  const user = await db.logitrack.MstUsers.findByPk(id);
  if (!user) return null;

  // We DO NOT delete from employee_db because it's the master HR database.
  // We only revoke their access to LogiTrack by removing them from mst_users.
  await user.destroy();
  return true;
};

module.exports = { getAll, getById, getEmployees, create, update, remove };
