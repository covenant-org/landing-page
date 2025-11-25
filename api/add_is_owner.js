const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  try {
    console.log('Running migration: Add is_owner column to users table...');

    // Add is_owner column
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_owner BOOLEAN DEFAULT false;
    `);
    console.log('✓ Added is_owner column');

    // Update shipping_country to allow full country names
    await pool.query(`
      ALTER TABLE users
      ALTER COLUMN shipping_country TYPE VARCHAR(100);
    `);
    console.log('✓ Updated shipping_country column type');

    // Set the first user as owner if no owner exists
    const result = await pool.query('SELECT COUNT(*) FROM users WHERE is_owner = true');
    const ownerCount = parseInt(result.rows[0].count);

    if (ownerCount === 0) {
      await pool.query(`
        UPDATE users
        SET is_owner = true
        WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
      `);
      console.log('✓ Set first user as organization owner');
    }

    console.log('\n✓ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
