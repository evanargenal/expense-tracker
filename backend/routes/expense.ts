import { Request, Response } from 'express';
import { Double } from 'mongodb';

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../database/db');

const authenticateToken = require('../middleware/authMiddleware');

interface AuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
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
            $addFields: {
              categoryId: {
                $ifNull: [
                  '$categoryId',
                  new ObjectId('000000000000000000000000'),
                ],
              }, // Ensure categoryId is never null
            },
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
              preserveNullAndEmptyArrays: true, // Keep documents even if lookup is empty
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
              categoryName: { $ifNull: ['$lookup.categoryName', ''] }, // Set empty string if null
              icon: { $ifNull: ['$lookup.icon', ''] }, // Set empty string if null
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
    const { name, description, cost, date, categoryName } = req.body;
    if (!name || (cost === '' && cost !== '0') || !date) {
      return res.status(400).json({
        message: 'All fields are required (name, cost, date)',
      });
    }
    try {
      const db = await connectDB();
      const expensesCollection = db.collection('expenses');
      const categoryCollection = db.collection('categories');

      // Find the category ID by category name
      let categoryId = new ObjectId('000000000000000000000000');

      if (categoryName) {
        // If categoryName is set, perform the findOne query
        const categoryIdObject = await categoryCollection.findOne({
          categoryName: categoryName,
        });
        // If the category is not found, make it default, else assign it
        if (!categoryIdObject) {
          categoryId = new ObjectId('000000000000000000000000');
        } else {
          categoryId = categoryIdObject._id;
        }
      }

      // Create new expense object
      const newExpense = {
        name,
        description,
        cost: new Double(cost), // Ensure cost is always a double
        date: new Date(date),
        userId: new ObjectId(String(currentUserId)),
        categoryId: categoryId,
      };

      // Insert user into the database
      await expensesCollection.insertOne(newExpense);

      res.status(201).json({
        message: 'Expense added successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete multiple expenses
// POST /api/expenses/delete
router.post('/delete', async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: 'Invalid request: provide an array of expense IDs' });
  }

  try {
    const db = await connectDB();
    const expensesCollection = db.collection('expenses');

    // Map ids to ObjectIds and delete them from the db
    const expenseObjectIds = ids.map((id) => new ObjectId(id));
    const result = await expensesCollection.deleteMany({
      _id: { $in: expenseObjectIds },
    });

    // If no expenses exist in database
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No matching expenses found' });
    }

    res.status(200).json({
      message: `Deleted ${result.deletedCount} expense(s) successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Delete expense by ID
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
    if (result.deletedCount === 0) {
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
