const express = require('express');
const server = express();
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./routes/user');
// const dotenv = require('dotenv');
// dotenv.config({ path: '../.env' });

server.use(cors());

// Middleware
server.use(express.json()); // To parse JSON request body

// Use user routes
server.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB().then(() => {
  console.log('Database running!');
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     const database = client.db('expense_tracker');
//     const users = database.collection('users');
//     // const query = { name: 'Evan Argenal' };
//     const allUsers = await users.find().toArray();
//     console.log(allUsers);
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

server.get('/', (req, res) => {
  res.send('Hello from my server!');
});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});
