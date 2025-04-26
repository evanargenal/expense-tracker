import { Request, Response } from 'express';

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const server = express();
const connectDB = require('./database/db');

const authRoutes = require('./routes/auth');
const incomeRoutes = require('./routes/income');
const expenseRoutes = require('./routes/expense');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');

server.use(cors());

// Middleware
server.use(express.json()); // To parse JSON request body
server.use(cookieParser()); // To parse cookies

// Mount routes
server.use('/api/auth', authRoutes);
server.use('/api/income', incomeRoutes);
server.use('/api/expenses', expenseRoutes);
server.use('/api/categories', categoryRoutes);
server.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB().then(() => {
  console.log('Database running!');
});

server.get('/', (req: Request, res: Response) => {
  res.send('Hello from my server!');
});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});
