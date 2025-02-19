const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../db');

const authenticateToken = require('../middleware/authMiddleware');

// Get all expenses for logged-in user
// GET /api/expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection('expenses');
    const currentUserId = req.user.userId;

    const expenses = await collection
      .find({ userId: new ObjectId(String(currentUserId)) })
      .toArray();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await connectDB();
    const collection = db.collection('users');

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
