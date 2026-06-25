const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
  connectionString: env.databaseUrl,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};