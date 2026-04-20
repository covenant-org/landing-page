const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all devices
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.*, u.email, u.name as user_name, s.nickname as subscription_name
       FROM devices d
       LEFT JOIN users u ON d.user_id = u.id
       LEFT JOIN subscriptions s ON d.subscription_id = s.id
       ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single device by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT d.*, u.email, u.name as user_name
       FROM devices d
       LEFT JOIN users u ON d.user_id = u.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET device metrics
router.get('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe } = req.query;

    let timeCondition = "recorded_at >= NOW() - INTERVAL '15 minutes'";
    if (timeframe === '3hours') {
      timeCondition = "recorded_at >= NOW() - INTERVAL '3 hours'";
    } else if (timeframe === '1day') {
      timeCondition = "recorded_at >= NOW() - INTERVAL '1 day'";
    } else if (timeframe === '7days') {
      timeCondition = "recorded_at >= NOW() - INTERVAL '7 days'";
    } else if (timeframe === '30days') {
      timeCondition = "recorded_at >= NOW() - INTERVAL '30 days'";
    }

    const result = await db.query(
      `SELECT * FROM device_metrics
       WHERE device_id = $1 AND ${timeCondition}
       ORDER BY recorded_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching device metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new device
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      subscription_id,
      device_type,
      device_name,
      starlink_id,
      serial_number,
      kit_number,
      software_version,
      status
    } = req.body;

    const result = await db.query(
      `INSERT INTO devices
       (user_id, subscription_id, device_type, device_name, starlink_id,
        serial_number, kit_number, software_version, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [user_id, subscription_id, device_type, device_name, starlink_id,
       serial_number, kit_number, software_version, status || 'offline']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST add device metric
router.post('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    const { metric_type, value, unit } = req.body;

    const result = await db.query(
      `INSERT INTO device_metrics (device_id, metric_type, value, unit)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, metric_type, value, unit]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding device metric:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update device
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      device_name,
      software_version,
      status,
      uptime_seconds,
      last_updated
    } = req.body;

    const result = await db.query(
      `UPDATE devices
       SET device_name = COALESCE($1, device_name),
           software_version = COALESCE($2, software_version),
           status = COALESCE($3, status),
           uptime_seconds = COALESCE($4, uptime_seconds),
           last_updated = COALESCE($5, last_updated)
       WHERE id = $6
       RETURNING *`,
      [device_name, software_version, status, uptime_seconds, last_updated, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE device
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM devices WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
