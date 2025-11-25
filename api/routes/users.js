const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET owner user
router.get('/profile/owner', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE is_owner = true LIMIT 1'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Owner user not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching owner user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const {
      email,
      name,
      phone,
      role,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country
    } = req.body;

    const result = await db.query(
      `INSERT INTO users
       (email, name, phone, role, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_zip, shipping_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [email, name, phone, role || 'user', shipping_address_line1, shipping_address_line2,
       shipping_city, shipping_state, shipping_zip, shipping_country]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      name,
      phone,
      role,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country
    } = req.body;

    const result = await db.query(
      `UPDATE users
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           phone = COALESCE($3, phone),
           role = COALESCE($4, role),
           shipping_address_line1 = COALESCE($5, shipping_address_line1),
           shipping_address_line2 = COALESCE($6, shipping_address_line2),
           shipping_city = COALESCE($7, shipping_city),
           shipping_state = COALESCE($8, shipping_state),
           shipping_zip = COALESCE($9, shipping_zip),
           shipping_country = COALESCE($10, shipping_country)
       WHERE id = $11
       RETURNING *`,
      [email, name, phone, role, shipping_address_line1, shipping_address_line2,
       shipping_city, shipping_state, shipping_zip, shipping_country, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
