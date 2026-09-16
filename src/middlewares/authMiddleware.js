const jwt = require("jsonwebtoken");
const { db } = require("../../config/sequelize");
const roleCache = require("../tools/cache");
const respond = require("../tools/response");

const APP_NAME = process.env.SERVICE_NAME || "logitrack";

/**
 * verifyToken(allowedRoles[])
 * Reads SESSION-LOGITRACK cookie → validates JWT → checks role in cache / DB
 */
const verifyToken = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies["SESSION-LOGITRACK"];
      if (!token) return respond(res, req, "unauthorized", null, 401, true);

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "logitrack-secret-key-change-in-prod");
      } catch (e) {
        return respond(res, req, "unauthorized", null, 401, true);
      }

      const { nik } = decoded;
      const cacheKey = `${APP_NAME}-${nik}`;

      let user = roleCache.get(cacheKey);

      if (!user) {
        user = await db.logitrack.MstUsers.findOne({ where: { nik, is_active: true } });
        if (!user) return respond(res, req, "unauthorized", null, 401, true);
        user = user.toJSON();
        
        // Remove password hash from session user object
        delete user.password_hash;
        roleCache.set(cacheKey, user);
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return respond(res, req, "forbidden", null, 403, true);
      }

      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      console.error("[authMiddleware]", err);
      return respond(res, req, "serverError", null, 500, true);
    }
  };
};

module.exports = { verifyToken };
