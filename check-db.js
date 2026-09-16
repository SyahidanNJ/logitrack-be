const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env.dev" });
const { db } = require("./config/sequelize");

(async () => {
  try {
    await db.sequelizeEmployee.authenticate();
    const emps = await db.employee_db.Employee.findAll({raw:true});
    console.log('Employees:', emps);
    const users = await db.logitrack.MstUsers.findAll({raw:true});
    console.log('Users:', users);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
