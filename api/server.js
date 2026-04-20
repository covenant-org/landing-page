const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const subscriptionsRouter = require('./routes/subscriptions');
const ordersRouter = require('./routes/orders');
const invoicesRouter = require('./routes/invoices');
const usersRouter = require('./routes/users');
const devicesRouter = require('./routes/devices');

// API routes
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/users', usersRouter);
app.use('/api/devices', devicesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Covenant API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Covenant API Server',
    version: '1.0.0',
    endpoints: {
      subscriptions: '/api/subscriptions',
      orders: '/api/orders',
      invoices: '/api/invoices',
      users: '/api/users',
      devices: '/api/devices'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Covenant API Server running on port ${PORT}`);
  console.log(`📍 API Documentation: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
