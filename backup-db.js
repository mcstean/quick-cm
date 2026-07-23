const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./config/database');

async function backupDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    const [merchants] = await sequelize.query('SELECT * FROM merchants');
    const [products] = await sequelize.query('SELECT * FROM products');
    const [orders] = await sequelize.query('SELECT * FROM orders');
    const [items] = await sequelize.query('SELECT * FROM order_items');
    const [riders] = await sequelize.query('SELECT * FROM riders');
    
    const backup = { merchants, products, orders, order_items: items, riders, date: new Date().toISOString() };
    const out = `/home/mcsteann/backups/quick_cm-json-backup-${new Date().toISOString().slice(0,10)}.json`;
    fs.writeFileSync(out, JSON.stringify(backup, null, 2));
    console.log(`✅ JSON backup written: ${out} (${fs.statSync(out).size} bytes)`);
    
    // Also try pg_dump with env creds
    const { execSync } = require('child_process');
    const dbUrl = process.env.DATABASE_URL || `postgres://${process.env.DB_USER||'postgres'}:${process.env.DB_PASSWORD}@${process.env.DB_HOST||'localhost'}:${process.env.DB_PORT||5432}/${process.env.DB_NAME||'quick_cm'}`;
    console.log('Trying pg_dump via DATABASE_URL...');
    try {
      execSync(`pg_dump "${dbUrl}" > /home/mcsteann/backups/quick_cm-pgdump-${new Date().toISOString().slice(0,10)}.sql`, { stdio:'inherit' });
      console.log('✅ pg_dump success');
    } catch(e) {
      console.log('⚠️ pg_dump failed (try manual), but JSON backup is safe');
    }
    process.exit(0);
  } catch(e) {
    console.error('Backup failed', e);
    process.exit(1);
  }
}
backupDB();
