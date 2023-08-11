const { Pool } = require("pg");
import config from "../config";

const data = config.postgres;

const pool = new Pool({
  user: data.username,
  host: data.host,
  database: data.database,
  password: data.password,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // This allows self-signed certificates. Use a valid CA certificate in production.
  },
});

async function query(text, params, callback) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
  //   return pool.query(text, params, callback);
}

// module.exports = query;
export default query;
