const express = require('express');
const router = express.Router();
const connectDB = require('../db');

// Get all users
// GET /api/users
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection('users');

    const users = await collection.find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { ObjectId } = require('mongodb');
    const users = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
