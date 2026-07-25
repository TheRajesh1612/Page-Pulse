require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
const rateLimiter = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const auditRoutes = require('./routes/audit');
const logger = require('./utils/logger');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request ID and Logger Middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  
  // Attach a request-scoped child logger
  req.log = logger.child({ reqId: req.id });
  
  // Log incoming request
  req.log.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// Apply rate limiting to all requests
app.use(rateLimiter);

// Routes
app.use('/api/v1/audit', auditRoutes);

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
