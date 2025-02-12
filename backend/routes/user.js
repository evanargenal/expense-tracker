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

// GET user by Email - WILL DELETE LATER
router.get('/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await db
      .collection('users')
      .findOne({ email: `${userEmail}` });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET user by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { ObjectId } = require('mongodb');
//     const users = await db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;
