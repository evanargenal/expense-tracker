const express = require('express');
const router = express.Router();
const connectDB = require('../db');

let db;
(async () => {
  db = await connectDB();
})();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
