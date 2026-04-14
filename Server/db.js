require("dotenv").config();
const { Pool } = require("pg");

// Pull DB configuration from environment variables.
// Create a connection pool using individual local settings.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  options: "-c search_path=public"
});

module.exports = pool;