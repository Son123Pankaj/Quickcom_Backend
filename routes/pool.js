const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

if (!connectionString) {
  console.warn('No database URL found. Set DATABASE_URL or DB_URL in your .env file.');
}

const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false,
  max: 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

const originalQuery = pool.query.bind(pool);

function convertMysqlPlaceholders(sql, values) {
  if (!sql) {
    return { sql: sql || '', values: values || [] };
  }

  const finalValues = Array.isArray(values) ? values : [];

  if (finalValues.length === 0) {
    return { sql, values: finalValues };
  }

  let convertedSql = '';
  let index = 0;

  for (let i = 0; i < sql.length; i += 1) {
    if (sql[i] === '?') {
      index += 1;
      convertedSql += `$${index}`;
    } else {
      convertedSql += sql[i];
    }
  }

  return { sql: convertedSql, values: finalValues };
}

pool.query = function queryCompat(sql, params, callback) {
  if (typeof sql !== 'string') {
    return originalQuery(sql, params, callback);
  }

  if (typeof params === 'undefined' && typeof callback === 'undefined') {
    return originalQuery(sql);
  }

  if (typeof params === 'function') {
    callback = params;
    params = undefined;
  }

  if (typeof callback === 'function') {
    const normalized = convertMysqlPlaceholders(sql, Array.isArray(params) ? params : []);
    return originalQuery(normalized.sql, normalized.values, callback);
  }

  const normalized = convertMysqlPlaceholders(sql, Array.isArray(params) ? params : []);
  return originalQuery(normalized.sql, normalized.values);
};

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

module.exports = pool;