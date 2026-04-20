const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setOwner() {
  try {
    console.log('Setting t@gmail.com as organization owner...');

    // First, remove owner flag from all users
    await pool.query('UPDATE users SET is_owner = false');
    console.log('✓ Cleared all existing owners');

    // Set t@gmail.com as the owner
    const result = await pool.query(
      `UPDATE users
       SET is_owner = true, role = 'owner'
       WHERE email = $1
       RETURNING *`,
      ['t@gmail.com']
    );

    if (result.rows.length === 0) {
      console.error('✗ User with email t@gmail.com not found');
      process.exit(1);
    }

    console.log('✓ Set t@gmail.com as organization owner');
    console.log('User details:', result.rows[0]);

    console.log('\n✓ Owner updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to set owner:', error);
    process.exit(1);
  }
}

setOwner();
