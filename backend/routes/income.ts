import { Request, Response } from 'express';
import { Double } from 'mongodb';

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../database/db');
import { verifyCategoryId } from '../utils/dbUtils';
import { validateDate, validateNumber } from '../utils/validators';
import { AuthenticatedUser, IncomeItem } from '../types/types';

const authenticateToken = require('../middleware/authMiddleware');

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Get current user's income items (auth)
// GET /api/income
router.get(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    try {
      const db = await connectDB();
      const incomeCollection = db.collection('income');

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 25;
      const rawSort = req.query.sort;
      const sortDirection =
        rawSort === 'asc' || rawSort === 'desc' ? rawSort : 'desc';

      const skip = (page - 1) * pageSize;
      const sort = sortDirection === 'asc' ? 1 : -1;

      const result = await incomeCollection
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
            $sort: { date: sort },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              amount: 1,
              date: 1,
              userId: 1,
              categoryId: 1,
              categoryName: { $ifNull: ['$lookup.categoryName', ''] }, // Set empty string if null
              icon: { $ifNull: ['$lookup.icon', ''] }, // Set empty string if null
            },
          },
          {
            $facet: {
              incomeItems: [{ $skip: skip }, { $limit: pageSize }],
              totalCount: [{ $count: 'count' }],
            },
          },
        ])
        .toArray();

      const incomeItems = result[0].incomeItems;
      const total = result[0].totalCount[0]?.count || 0;

      const mappedIncome = incomeItems.map((incomeItem: IncomeItem) => ({
        _id: incomeItem._id,
        name: incomeItem.name,
        description: incomeItem.description,
        amount: incomeItem.amount,
        date: incomeItem.date,
        userId: incomeItem.userId,
        categoryId: incomeItem.categoryId,
        categoryName: incomeItem.categoryName,
        icon: incomeItem.icon,
      }));

      res.status(200).json({
        incomeList: mappedIncome,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
        sortOrder: sortDirection,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Add income item to current user (auth)
// POST /api/income
router.post(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const { name, description, amount, date, categoryId } = req.body;
    if (!name || (amount === '' && amount !== '0') || !date) {
      return res.status(400).json({
        error: 'Name, amount, and date fields are required',
      });
    }
    try {
      const db = await connectDB();
      const incomeCollection = db.collection('income');
      const categoriesCollection = db.collection('categories');

      // Verify the category
      const verifiedCategory = await verifyCategoryId(
        categoryId,
        categoriesCollection
      );

      // Create new income object
      const newIncomeItem = {
        name,
        description,
        amount: new Double(amount), // Ensure amount is always a double
        date: new Date(date),
        userId: new ObjectId(currentUserId),
        categoryId: verifiedCategory,
      };

      // Insert user into the database
      const result = await incomeCollection.insertOne(newIncomeItem);

      res.status(201).json({
        message: 'Income item added successfully',
        id: result.insertedId,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Update multiple income categories (auth)
// PATCH /api/income/update-categories
router.patch(
  '/update-categories',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const { ids, newCategoryId } = req.body;

    if (
      !ids ||
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => ObjectId.isValid(id))
    ) {
      return res.status(400).json({
        error: 'Provide an array of valid income item IDs',
      });
    }
    if (newCategoryId !== '' && !ObjectId.isValid(newCategoryId)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID format for new category ID' });
    }
    try {
      const db = await connectDB();
      const incomeCollection = db.collection('income');
      const categoriesCollection = db.collection('categories');

      // Verify the new category
      const verifiedCategory = await verifyCategoryId(
        newCategoryId,
        categoriesCollection
      );

      // Map ids to ObjectIds and update their category in the db
      const incomeObjectIds = ids.map((id) => new ObjectId(id));
      const result = await incomeCollection.updateMany(
        { _id: { $in: incomeObjectIds }, userId: new ObjectId(currentUserId) }, // Ensure the user owns the income item
        { $set: { categoryId: verifiedCategory } }
      );

      // If no income items exist in database
      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ error: 'No matching income items found' });
      }

      res.status(200).json({
        message: `Updated ${result.modifiedCount} income item(s) successfully`,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Update income item field(s) by ID (auth)
// PATCH /api/income/:id
router.patch(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const incomeId = req.params.id;
    const updateFields = req.body; // Only include fields that need updating

    if (!ObjectId.isValid(incomeId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Define the allowed fields for update
    const allowedFields = [
      'date',
      'name',
      'description',
      'categoryId',
      'amount',
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
          error: 'Invalid value for date - must be a valid date string.',
        });
      }
      filteredUpdates.date = validatedDate;
    }
    // Validate 'amount' field if it exists
    if (filteredUpdates.amount !== undefined) {
      const validatedAmount = validateNumber(filteredUpdates.amount);
      if (validatedAmount === null) {
        return res
          .status(400)
          .json({ error: 'Invalid value for amount - must be a number.' });
      }
      filteredUpdates.amount = validatedAmount;
    }
    try {
      const db = await connectDB();
      const incomeCollection = db.collection('income');
      const categoriesCollection = db.collection('categories');

      // Validate 'categoryId' field if it exists

      const verifiedCategory = await verifyCategoryId(
        filteredUpdates.categoryId as string,
        categoriesCollection
      );
      filteredUpdates.categoryId = verifiedCategory;

      // Update income item field(s) by ID in the database
      const result = await incomeCollection.updateOne(
        { _id: new ObjectId(incomeId) },
        { $set: filteredUpdates } // Only updates the fields provided
      );

      // If income item doesn't exist in database
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Income item not found' });
      }

      res.status(200).json({
        message: 'Income item updated successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete multiple income items (auth)
// POST /api/income/delete
router.post(
  '/delete',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { ids } = req.body;
    if (
      !ids ||
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => ObjectId.isValid(id))
    ) {
      return res.status(400).json({
        error: 'Provide an array of valid income item IDs',
      });
    }

    try {
      const db = await connectDB();
      const incomeCollection = db.collection('income');

      // Map ids to ObjectIds and delete them from the db
      const incomeObjectIds = ids.map((id) => new ObjectId(id));
      const result = await incomeCollection.deleteMany({
        _id: { $in: incomeObjectIds },
      });

      // If no income items exist in database
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: 'No matching income items found' });
      }

      res.status(200).json({
        message: `Deleted ${result.deletedCount} income item(s) successfully`,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete income item by ID (auth)
// DELETE /api/income/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const incomeId = req.params.id;
  if (!ObjectId.isValid(incomeId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const db = await connectDB();
    const incomeCollection = db.collection('income');

    // Delete income item by ID in the database
    const result = await incomeCollection.deleteOne({
      _id: new ObjectId(incomeId),
    });

    // If income item doesn't exist in database
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Income item not found' });
    }

    res.status(200).json({
      message: 'Income item deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
