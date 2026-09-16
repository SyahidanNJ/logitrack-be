"use strict";

const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const operatorsAliases = {
  $and: Op.and,
  $or: Op.or,
  $eq: Op.eq,
  $ne: Op.ne,
  $gt: Op.gt,
  $lt: Op.lt,
  $lte: Op.lte,
  $gte: Op.gte,
  $like: Op.like,
  $between: Op.between,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
};

// ── Helper: build Sequelize instance from env prefix ──────────────────────
function buildInstance(prefix, dialect) {
  const p = process.env;
  const PRE = `MYSQL_${prefix}_`;

  const pool = {
    min: Number(p[`${PRE}POOL_MIN`] || 0),
    max: Number(p[`${PRE}POOL_MAX`] || 10),
    idle: Number(p[`${PRE}POOL_IDLE`] || 10000),
    acquire: Number(p[`${PRE}POOL_ACQUIRE`] || 60000),
    evict: Number(p[`${PRE}POOL_EVICT`] || 10000),
    handleDisconnects: true,
  };

  const instance = new Sequelize(
    p[`${PRE}NAME`],
    p[`${PRE}USER`],
    p[`${PRE}PASS`] || "",
    {
      host: p[`${PRE}HOST`] || "localhost",
      port: Number(p[`${PRE}PORT`] || 3306),
      dialect: dialect || p[`${PRE}DIALECT`] || "mysql",
      pool,
      operatorsAliases,
      logging: p[`${PRE}LOGGING`] === "true" ? console.log : false,
      dialectOptions: {
        connectTimeout: Number(p[`${PRE}DIALECT_CONNECT_TIMEOUT`] || 60000),
        // TiDB Cloud (dan managed MySQL lain) mewajibkan TLS.
        // Aktifkan via MYSQL_SSL=true di production; lokal tetap tanpa SSL.
        ...(p.MYSQL_SSL === "true"
          ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
          : {}),
      },
      define: {
        underscored: true,
        timestamps: true,
      },
    }
  );

  return instance;
}

// ── Build instances ────────────────────────────────────────────────────────
const sequelizeLogitrack = buildInstance("LOGITRACK", "mysql");
const sequelizeEmployee = buildInstance("EMPLOYEE", "mysql");

const authenticateDB = async (instance, name) => {
  try {
    await instance.authenticate();
    console.log(`[OK] DB ${name} connected!`);
  } catch (err) {
    console.error(`[ERR] DB ${name} connection error!`, err.message);
    if (err.parent && err.parent.code === 'ER_BAD_DB_ERROR') {
      console.log(`[INIT] Creating database ${name} since it does not exist...`);
      // We must connect without specifying a database to create it
      const tempInstance = new Sequelize(
        '',
        process.env[`MYSQL_${name}_USER`],
        process.env[`MYSQL_${name}_PASS`] || "",
        {
          host: process.env[`MYSQL_${name}_HOST`] || "localhost",
          port: Number(process.env[`MYSQL_${name}_PORT`] || 3306),
          dialect: "mysql",
          logging: false,
          dialectOptions: {
            ...(process.env.MYSQL_SSL === "true"
              ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
              : {}),
          }
        }
      );
      await tempInstance.query(`CREATE DATABASE IF NOT EXISTS \`${process.env[`MYSQL_${name}_NAME`]}\`;`);
      await tempInstance.close();
      console.log(`[OK] Database ${name} created. Retry connecting...`);
      // Re-authenticate
      await instance.authenticate();
      console.log(`[OK] DB ${name} connected on retry!`);
    }
  }
};

authenticateDB(sequelizeLogitrack, "LOGITRACK");
authenticateDB(sequelizeEmployee, "EMPLOYEE");

// ── Load models ───────────────────────────────────────────────────────────
function loadModels(sequelizeInstance, dir) {
  const models = {};
  const absDir = path.join(__dirname, dir);
  if (!fs.existsSync(absDir)) return models;

  fs.readdirSync(absDir)
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const model = require(path.join(absDir, file))(sequelizeInstance, Sequelize.DataTypes);
      models[model.name] = model;
    });

  // Run associations
  Object.values(models).forEach((model) => {
    if (model.associate) model.associate(models);
  });

  return models;
}

const logitrackModels = loadModels(sequelizeLogitrack, "../src/models");
const employeeModels = loadModels(sequelizeEmployee, "../src/models_employee");

// ── Sync DBs (creates tables if not exist) ───────────────────────────
// alter hanya di non-production; di production schema dianggap stabil
// agar tidak ada perubahan/hilang kolom saat service restart.
const syncAlter = process.env.NODE_ENV !== "production";
sequelizeLogitrack
  .sync({ alter: syncAlter })
  .then(async () => {
    // Seed departments if empty
    const count = await logitrackModels.MstDepartment.count();
    if (count === 0) {
      await logitrackModels.MstDepartment.bulkCreate([
        { code: 'HR', name: 'Human Resources' },
        { code: 'IT', name: 'Information Technology' },
        { code: 'LOG', name: 'Logistics & Warehouse' },
        { code: 'FIN', name: 'Finance & Accounting' },
        { code: 'OPS', name: 'Operations' }
      ]);
      console.log("[INIT] Seeded initial departments to logitrack DB");
    }
  })
  .catch((err) => console.error("[DB] logitrack sync error:", err.message));

sequelizeEmployee
  .sync({ alter: syncAlter })
  .then(async () => {
    // Seed an admin employee if empty
    const md5 = require("md5");
    const count = await employeeModels.Employee.count();
    if (count === 0) {
      await employeeModels.Employee.create({
        nik: "ADMIN-001",
        name: "Super Administrator",
        email: "admin@logitrack.com",
        password: md5("password123")
      });
      console.log("[INIT] Seeded initial admin employee to employee_db");

      // Also seed it in LogiTrack DB
      const userCount = await logitrackModels.MstUsers.count();
      if (userCount === 0) {
        await logitrackModels.MstUsers.create({
          nik: "ADMIN-001",
          name: "Super Administrator",
          password_hash: "deprecated",
          role: "superadmin",
          email: "admin@logitrack.com",
          department: "IT"
        });
        console.log("[INIT] Seeded initial admin to logitrack DB");
      }
    }
  })
  .catch((err) => console.error("[DB] employee sync error:", err.message));

// ── Export ─────────────────────────────────────────────────────────────────
const db = {
  logitrack: logitrackModels,
  employee_db: employeeModels,
  sequelizeLogitrack,
  sequelizeEmployee,
  Sequelize,
};

module.exports = { db };
