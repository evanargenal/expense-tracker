const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../database/db');

const authenticateToken = require('../middleware/authMiddleware');

// Get all expenses for logged-in user
// GET /api/expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    // const expensesCollection = db.collection('expenses');
    const currentUserId = req.user.userId;

    const result = await db
      .collection('expenses')
      .aggregate([
        {
          $match: { userId: new ObjectId(String(currentUserId)) }, // Filter by userId before lookup
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'lookup',
          },
        },
        {
          $unwind: {
            path: '$lookup',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            cost: 1,
            date: 1,
            userId: 1,
            categoryName: '$lookup.categoryName',
            icon: '$lookup.icon',
          },
        },
      ])
      .toArray();

    res.status(200).json(
      result.map((expense) => ({
        _id: expense._id,
        name: expense.name,
        description: expense.description,
        cost: expense.cost,
        date: expense.date,
        userId: expense.userId,
        categoryName: expense.categoryName,
        icon: expense.icon,
      }))
    );

    // const expenses = await expensesCollection
    //   .find({ userId: new ObjectId(String(currentUserId)) })
    //   .toArray();
    // res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Add expense to current user
// POST /api/expenses
router.post('/', authenticateToken, async (req, res) => {
  const currentUserId = req.user.userId;
  const { name, description, cost, date, categoryId } = req.body;
  if (!name || !description || !cost || !date || !categoryId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const db = await connectDB();
    const expensesCollection = db.collection('expenses');

    const expenses = await expensesCollection
      .find({ userId: new ObjectId(String(currentUserId)) })
      .toArray();

    // Create new expense object
    const newExpense = {
      name,
      description,
      cost: parseFloat(cost),
      date: new Date(date),
      userId: new ObjectId(String(currentUserId)),
      categoryId: new ObjectId(String(categoryId)),
    };

    // Insert user into the database
    const result = await expensesCollection.insertOne(newExpense);

    res.status(201).json({
      message: 'Expense added successfully!',
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get user by ID
// GET /api/users/:id
// router.get('/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const db = await connectDB();
//     const collection = db.collection('users');

//     const user = await collection.findOne({ _id: new ObjectId(userId) });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;
