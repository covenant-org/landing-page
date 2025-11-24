const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT i.*, u.email, u.name as user_name, s.nickname as subscription_name
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       LEFT JOIN subscriptions s ON i.subscription_id = s.id
       ORDER BY i.invoice_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT i.*, u.email, u.name as user_name
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new invoice
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      subscription_id,
      invoice_number,
      invoice_date,
      due_date,
      description,
      payment_method,
      total_amount,
      balance_due,
      status
    } = req.body;

    const result = await db.query(
      `INSERT INTO invoices
       (user_id, subscription_id, invoice_number, invoice_date, due_date,
        description, payment_method, total_amount, balance_due, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [user_id, subscription_id, invoice_number, invoice_date, due_date,
       description, payment_method, total_amount, balance_due || 0, status || 'unpaid']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update invoice
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { balance_due, status, pdf_url } = req.body;

    const result = await db.query(
      `UPDATE invoices
       SET balance_due = COALESCE($1, balance_due),
           status = COALESCE($2, status),
           pdf_url = COALESCE($3, pdf_url)
       WHERE id = $4
       RETURNING *`,
      [balance_due, status, pdf_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
