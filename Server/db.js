const { Pool } = require('pg');

// Pull DB configuration from environment variables.
// Create a connection pool using individual local settings.
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'FlatMate',
    password: 'postgres',
    port: 5432,
    options: "-c search_path=public"
  });

module.exports = pool;