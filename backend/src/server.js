const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 TaskFlow Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks API:   http://localhost:${PORT}/api/tasks`);
  console.log(`===============================================`);
});

// Handle graceful shutdown (Docker & Kubernetes pod termination)
const handleGracefulShutdown = (signal) => {
  console.log(`[TaskFlow Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[TaskFlow Server] HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections linger
  setTimeout(() => {
    console.error('[TaskFlow Server] Forced shutdown timeout reached.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
