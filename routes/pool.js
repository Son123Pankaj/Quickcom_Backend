const mysql = require('mysql');

// In production we require explicit DB env vars to avoid silent misconfiguration
if (process.env.NODE_ENV === 'production') {
  const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = requiredEnv.filter(k => !process.env[k] || process.env[k].toString().trim() === '');
  if (missing.length) {
    console.error('Missing required DB env vars:', missing.join(', '), '-- set them before starting.');
    process.exit(1);
  }
  if ((process.env.DB_HOST || '').includes('your_cloud_mysql_host')) {
    console.error('DB_HOST is set to placeholder "your_cloud_mysql_host". Please set a real host in DB_HOST.');
    process.exit(1);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'quickcom',
  multipleStatements: true,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error(`MySQL connection failed to host="${process.env.DB_HOST || 'unknown'}":`, err && err.code ? `${err.code} - ${err.message}` : (err && err.message) || err);
    return;
  }

  console.log('MySQL connected successfully.');
  connection.release();
});

module.exports = pool;