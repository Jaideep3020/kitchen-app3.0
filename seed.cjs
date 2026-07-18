const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
});
async function seed() {
  await pool.query('INSERT INTO activity_logs (title, description, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', ['Breakfast Waste Logged', '1.2kg Pongal and Vada discarded.', 'waste']).catch(e => console.log(e));
  process.exit(0);
}
seed();
