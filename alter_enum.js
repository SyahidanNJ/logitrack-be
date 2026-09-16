require('dotenv').config();
const { db } = require('./config/sequelize');

async function addCol() {
  try {
    await db.sequelizeLogitrack.query("ALTER TABLE tr_check_ins ADD COLUMN document_file VARCHAR(255);").catch(e => console.log(e.message));
    await db.sequelizeLogitrack.query("ALTER TABLE tr_check_outs ADD COLUMN document_file VARCHAR(255);").catch(e => console.log(e.message));
    console.log("Document file columns added successfully in LogiTrack DB");
  } catch (err) {
    console.error("Error adding columns:", err);
  } finally {
    process.exit(0);
  }
}

setTimeout(addCol, 1000);
