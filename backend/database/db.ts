import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const client = new MongoClient(process.env.MONGODB_URI!);
let db: Db | null = null;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('expense_tracker');
      console.log('MongoDB connected!');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
  return db;
}

module.exports = connectDB;
