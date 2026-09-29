const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @desc   Health check endpoint for Kubernetes liveness/readiness probes & Docker healthcheck
 * @route  GET /api/health
 */
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    status: 'OK',
    service: 'TaskFlow Backend',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      connected: dbState === 1,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
