const mysql = require('mysql2/promise');
(async () => {
  const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'logitrack' });
  await connection.query("INSERT IGNORE INTO mst_products (id, sku, name, created_at, updated_at) VALUES (1, 'SKU-001', 'Dummy Product', NOW(), NOW())");
  // wait, to create zone, we need warehouse!
  await connection.query("INSERT IGNORE INTO mst_warehouses (id, code, name, created_at, updated_at) VALUES (1, 'WH-01', 'Dummy Warehouse', NOW(), NOW())");
  await connection.query("INSERT IGNORE INTO mst_zones (id, warehouse_id, code, name, created_at, updated_at) VALUES (1, 1, 'Z-01', 'Dummy Zone', NOW(), NOW())");
  await connection.query("INSERT IGNORE INTO mst_bin_locations (id, zone_id, code, created_at, updated_at) VALUES (1, 1, 'B-01', NOW(), NOW())");
  console.log('Seeded successfully!');
  process.exit(0);
})();
