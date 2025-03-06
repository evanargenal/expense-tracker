import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
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

interface ExpenseItem {
  _id: string;
  categoryName: string;
  cost: number;
  date: Date;
  description: string;
  icon: string;
  name: string;
  userId: string;
}

// Get all expenses for logged-in user
// GET /api/expenses
router.get(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const db = await connectDB();
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }
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
        result.map((expense: ExpenseItem) => ({
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
  }
);

// Add expense to current user
// POST /api/expenses
router.post(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
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
        message: 'Expense added successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Get expense by ID
// DELETE /api/expenses/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const expenseId = req.params.id;
  try {
    const db = await connectDB();
    const expensesCollection = db.collection('expenses');

    // Delete expense by ID in the database
    const result = await expensesCollection.deleteOne({
      _id: new ObjectId(String(expenseId)),
    });

    // If expense doesn't exist in database
    if (result.deletedCount < 1) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
