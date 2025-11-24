const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all subscriptions
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.email, u.name as user_name
       FROM subscriptions s
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT s.*, u.email, u.name as user_name
       FROM subscriptions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new subscription
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      subscription_number,
      nickname,
      service_location,
      service_plan,
      status,
      monthly_data_gb
    } = req.body;

    const result = await db.query(
      `INSERT INTO subscriptions
       (user_id, subscription_number, nickname, service_location, service_plan, status, monthly_data_gb)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, subscription_number, nickname, service_location, service_plan, status || 'active', monthly_data_gb || 350]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update subscription
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nickname,
      service_location,
      service_plan,
      status,
      ip_policy,
      monthly_data_gb,
      data_used_gb,
      auto_top_up
    } = req.body;

    const result = await db.query(
      `UPDATE subscriptions
       SET nickname = COALESCE($1, nickname),
           service_location = COALESCE($2, service_location),
           service_plan = COALESCE($3, service_plan),
           status = COALESCE($4, status),
           ip_policy = COALESCE($5, ip_policy),
           monthly_data_gb = COALESCE($6, monthly_data_gb),
           data_used_gb = COALESCE($7, data_used_gb),
           auto_top_up = COALESCE($8, auto_top_up)
       WHERE id = $9
       RETURNING *`,
      [nickname, service_location, service_plan, status, ip_policy, monthly_data_gb, data_used_gb, auto_top_up, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE subscription
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM subscriptions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
