const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Falls back gracefully if connection fails
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[TaskFlow DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[TaskFlow DB Error] Failed to connect to MongoDB: ${error.message}`);
    // If not in test mode, exit with failure
    if (process.env.NODE_ENV !== 'test') {
      console.log('[TaskFlow DB] Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    }
  }
};

module.exports = connectDB;
