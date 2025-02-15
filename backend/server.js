const express = require('express');
const cors = require('cors');

const server = express();
const connectDB = require('./db');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

server.use(cors());

// Middleware
server.use(express.json()); // To parse JSON request body

// Mount routes
server.use('/api/users', userRoutes);
server.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB().then(() => {
  console.log('Database running!');
});

server.get('/', (req, res) => {
  res.send('Hello from my server!');
});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});
