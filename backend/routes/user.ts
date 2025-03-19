import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../database/db');

// Get all users
// GET /api/users
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
