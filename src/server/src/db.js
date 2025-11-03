const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
  override: true,
});

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function ping() {
  const [r] = await pool.query('SELECT 1 AS ok');
  return r[0]?.ok === 1;
}

// callback-compat shim for legacy routes: db.query(sql, params, cb)
function query(sql, params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }
  pool.query(sql, params)
    .then(([rows]) => cb(null, rows))
    .catch(err => cb(err));
}

module.exports = { pool, ping, query };
