const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, u.email, u.name as user_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.order_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT o.*, u.email, u.name as user_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      order_number,
      order_date,
      status,
      item_name,
      item_description,
      tracking_number,
      tracking_url,
      estimated_delivery,
      total_amount
    } = req.body;

    const result = await db.query(
      `INSERT INTO orders
       (user_id, order_number, order_date, status, item_name, item_description,
        tracking_number, tracking_url, estimated_delivery, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [user_id, order_number, order_date, status || 'processing', item_name,
       item_description, tracking_number, tracking_url, estimated_delivery, total_amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      tracking_number,
      tracking_url,
      estimated_delivery
    } = req.body;

    const result = await db.query(
      `UPDATE orders
       SET status = COALESCE($1, status),
           tracking_number = COALESCE($2, tracking_number),
           tracking_url = COALESCE($3, tracking_url),
           estimated_delivery = COALESCE($4, estimated_delivery)
       WHERE id = $5
       RETURNING *`,
      [status, tracking_number, tracking_url, estimated_delivery, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM orders WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
