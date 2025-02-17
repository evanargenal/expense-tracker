const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const router = express.Router();
const connectDB = require('../db');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});

// Authenticate user
// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = await connectDB();
    const collection = db.collection('users');

    // Find user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const tokenPayload = { userId: user._id, email: user.email };
    const tokenOptions = { expiresIn: '1h' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenOptions);

    // Update logged in status to true in the database
    await collection.updateOne(
      { email: email },
      { $set: { isLoggedIn: true } }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      name: user.fullName,
      isLoggedIn: true,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Log out user
// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const db = await connectDB();
    const collection = db.collection('users');

    // Update logged in status to false in the database
    await collection.updateOne(
      { email: email },
      { $set: { isLoggedIn: false } }
    );

    res.status(200).json({
      message: 'Logout successful',
      isLoggedIn: false,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new user
// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { fullName, email, password, isLoggedIn, isAdmin } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const db = await connectDB();
    const collection = db.collection('users');

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      isLoggedIn,
      isAdmin,
    };

    // Insert user into the database
    const result = await collection.insertOne(newUser);

    // Generate JWT token
    const tokenPayload = { userId: result._id, email: newUser.email };
    const tokenOptions = { expiresIn: '1h' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenOptions);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      name: fullName,
      isLoggedIn: true,
      isAdmin: false,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
