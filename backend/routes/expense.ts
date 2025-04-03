import { Request, Response } from 'express';
import { Double } from 'mongodb';

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../database/db');
import { validateDate, validateCost } from '../utils/validators';
import { getCategoryIdByName } from '../utils/dbUtils';
import { AuthenticatedUser, ExpenseItem } from '../types/types';

const authenticateToken = require('../middleware/authMiddleware');

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Get current user's expenses (auth)
// GET /api/expenses
router.get(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const db = await connectDB();
      if (!req.user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const expensesCollection = db.collection('expenses');

      const currentUserId = req.user.userId;
      const result = await expensesCollection
        .aggregate([
          {
            $match: { userId: new ObjectId(currentUserId) }, // Filter by userId before lookup
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

// Add expense to current user (auth)
// POST /api/expenses
router.post(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const { name, description, cost, date, categoryName } = req.body;
    if (!name || (cost === '' && cost !== '0') || !date) {
      return res.status(400).json({
        error: 'All fields are required (name, cost, date)',
      });
    }
    try {
      const db = await connectDB();
      const expensesCollection = db.collection('expenses');
      const categoriesCollection = db.collection('categories');

      // Find the category ID by category name
      const categoryId = await getCategoryIdByName(
        categoryName,
        categoriesCollection
      );

      // Create new expense object
      const newExpense = {
        name,
        description,
        cost: new Double(cost), // Ensure cost is always a double
        date: new Date(date),
        userId: new ObjectId(currentUserId),
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

// Update multiple expense categories (auth)
// PATCH /api/expenses/update-categories
router.patch(
  '/update-categories',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const { ids, newCategoryId } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: 'Invalid request: provide an array of expense IDs' });
    }
    if (!newCategoryId || !ObjectId.isValid(newCategoryId)) {
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    try {
      const db = await connectDB();
      const expensesCollection = db.collection('expenses');
      const categoriesCollection = db.collection('categories');

      // Check if the new category exists
      const categoryExists = await categoriesCollection.findOne({
        _id: new ObjectId(newCategoryId),
      });
      if (!categoryExists) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Map ids to ObjectIds and update their category in the db
      const expenseObjectIds = ids.map((id) => new ObjectId(id));
      const result = await expensesCollection.updateMany(
        { _id: { $in: expenseObjectIds }, userId: new ObjectId(currentUserId) }, // Ensure the user owns the expenses
        { $set: { categoryId: new ObjectId(newCategoryId) } }
      );

      // If no expenses exist in database
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'No matching expenses found' });
      }

      res.status(200).json({
        message: `Updated ${result.modifiedCount} expense(s) successfully`,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Update expense field(s) by ID (auth)
// PATCH /api/expenses/:id
router.patch(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const expenseId = req.params.id;
    const updateFields = req.body; // Only include fields that need updating

    if (!ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Define the allowed fields for update
    const allowedFields = [
      'date',
      'name',
      'description',
      'categoryName',
      'cost',
    ];

    // Filter out any fields that are not part of the schema
    const filteredUpdates = Object.fromEntries(
      Object.entries(updateFields).filter(([key]) =>
        allowedFields.includes(key)
      )
    );
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Validate 'date' field if it exists
    if (filteredUpdates.date !== undefined) {
      const validatedDate = validateDate(filteredUpdates.date);
      if (validatedDate === null) {
        return res.status(400).json({
          error: 'Invalid value for date. It must be a valid date string.',
        });
      }
      filteredUpdates.date = validatedDate;
    }

    // Validate 'cost' field if it exists
    if (filteredUpdates.cost !== undefined) {
      const validatedCost = validateCost(filteredUpdates.cost);
      if (validatedCost === null) {
        return res
          .status(400)
          .json({ error: 'Invalid value for cost. It must be a number.' });
      }
      filteredUpdates.cost = validatedCost;
    }
    try {
      const db = await connectDB();
      const expensesCollection = db.collection('expenses');
      const categoriesCollection = db.collection('categories');

      // Validate 'categoryName' field if it exists
      if (filteredUpdates.categoryName !== undefined) {
        const validatedCategoryId = await getCategoryIdByName(
          String(filteredUpdates.categoryName),
          categoriesCollection
        );
        // Assign the retrieved categoryId to filteredUpdates
        filteredUpdates.categoryId = validatedCategoryId;

        // Remove the original categoryName since it's no longer needed
        delete filteredUpdates.categoryName;
      }

      // Update expense fields by ID in the database
      const result = await expensesCollection.updateOne(
        { _id: new ObjectId(expenseId) },
        { $set: filteredUpdates } // Only updates the fields provided
      );

      // If expense doesn't exist in database
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      res.status(200).json({
        message: 'Expense updated successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete multiple expenses (auth)
// POST /api/expenses/delete
router.post(
  '/delete',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: 'Invalid request: provide an array of expense IDs' });
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
        return res.status(404).json({ error: 'No matching expenses found' });
      }

      res.status(200).json({
        message: `Deleted ${result.deletedCount} expense(s) successfully`,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete expense by ID (auth)
// DELETE /api/expenses/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const expenseId = req.params.id;
  if (!ObjectId.isValid(expenseId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const db = await connectDB();
    const expensesCollection = db.collection('expenses');

    // Delete expense by ID in the database
    const result = await expensesCollection.deleteOne({
      _id: new ObjectId(expenseId),
    });

    // If expense doesn't exist in database
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
