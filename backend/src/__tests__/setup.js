const pool = require('../config/db');

// Clear all tables before each test
beforeEach(async () => {
  await pool.query('DELETE FROM turns');
  await pool.query('DELETE FROM resources');
  await pool.query('DELETE FROM tiles');
  await pool.query('DELETE FROM events');
  await pool.query('DELETE FROM players');
  await pool.query('DELETE FROM worlds');
});

// Close pool after all tests
afterAll(async () => {
  await pool.end();
});
