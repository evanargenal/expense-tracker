const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log('MongoDB connected!');
    return client.db('expense_tracker'); // Return the database object
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
