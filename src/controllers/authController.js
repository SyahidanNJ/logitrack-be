const authService = require("../services/authService");
const respond = require("../tools/response");

const login = async (req, res) => {
  try {
    const { nik, password } = req.body;
    
    if (!nik || !password) {
      return respond(res, req, "badRequest", { error: "NIK and password are required" }, 400, true);
    }

    const result = await authService.login(nik, password);
    if (!result) {
      return respond(res, req, "loginFailed", null, 401, true);
    }

    res.cookie("SESSION-LOGITRACK", result.token, {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });

    return respond(res, req, "loginSuccess", result.user, 200, false);
  } catch (error) {
    console.error(error);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const sso = async (req, res) => {
  try {
    const { employeeCode } = req.body;
    
    if (!employeeCode) {
      return respond(res, req, "badRequest", { error: "employeeCode is required" }, 400, true);
    }

    const result = await authService.sso(employeeCode);
    if (!result) {
      return respond(res, req, "unauthorized", null, 401, true);
    }

    res.cookie("SESSION-LOGITRACK", result.token, {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000
    });

    return respond(res, req, "loginSuccess", result.user, 200, false);
  } catch (error) {
    console.error(error);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const logout = (req, res) => {
  const token = req.cookies["SESSION-LOGITRACK"];
  if (token) {
    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.nik) {
        authService.logout(decoded.nik);
      }
    } catch (e) {
      // ignore token parse errors on logout
    }
  }
  
  res.clearCookie("SESSION-LOGITRACK");
  return respond(res, req, "logoutSuccess", null, 200, false);
};

const me = (req, res) => {
  return respond(res, req, "success", req.user, 200, false);
};

module.exports = {
  login,
  sso,
  logout,
  me
};
