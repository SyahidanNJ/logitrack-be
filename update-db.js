 const Sequelize = require('sequelize');
const sequelize = new Sequelize('logitrack', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

async function run() {
  try {
    await sequelize.authenticate();
    // 1. Change to VARCHAR temporarily to bypass ENUM strictness
    await sequelize.query("ALTER TABLE mst_zones MODIFY COLUMN type VARCHAR(100)");
    
    // 2. Update existing invalid data
    await sequelize.query("UPDATE mst_zones SET type = 'storage' WHERE type NOT IN ('inbound', 'outbound', 'storage', 'quarantine', 'staging') OR type IS NULL");
    
    // 3. Alter column to new ENUM
    await sequelize.query("ALTER TABLE mst_zones MODIFY COLUMN type ENUM('inbound', 'outbound', 'storage', 'quarantine', 'staging') DEFAULT 'storage'");
    
    console.log('Database updated successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}
run();
