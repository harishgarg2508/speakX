const { MongoClient } = require('mongodb');
const config = require('../config/db.config');

let db = null;

async function connectDB() {
    try {
      const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      console.log('Connected to MongoDB Atlas');
      db = client.db('speakx');
      return db;
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  }

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

module.exports = { connectDB, getDB };