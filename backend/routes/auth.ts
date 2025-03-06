import { Request, Response } from 'express';

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const router = express.Router();
const connectDB = require('../database/db');

const authenticateToken = require('../middleware/authMiddleware');

interface AuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  exp: number;
  iat: number;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Validate token
// GET /api/auth/validate
router.get(
  '/validate',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: 'Token is valid', user: req.user });
  }
);

// Authenticate user
// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  email = email.toLowerCase();

  try {
    const db = await connectDB();
    const collection = db.collection('users');

    // Find user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
    };
    const tokenOptions = { expiresIn: '1h' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenOptions);

    res.cookie('token', token, {
      httpOnly: true, // Prevent access from JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new user
// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  let { fullName, email, password, isAdmin } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  email = email.toLowerCase();

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
      isAdmin,
    };

    // Insert user into the database
    const result = await collection.insertOne(newUser);

    // Generate JWT token
    const tokenPayload = {
      userId: result.insertedId,
      email: newUser.email,
      fullName: newUser.fullName,
    };
    const tokenOptions = { expiresIn: '1h' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenOptions);

    res.cookie('token', token, {
      httpOnly: true, // Prevent access from JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({
      fullName: fullName,
      email: email,
      isAdmin: false,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout user
// GET /api/auth/logout
router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
