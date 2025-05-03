import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../database/db');
import { validateSingleEmoji } from '../utils/validators';
import { AuthenticatedUser, Category } from '../types/types';

const authenticateToken = require('../middleware/authMiddleware');

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Get current user's categories (auth)
// GET /api/categories
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
      const categoriesCollection = db.collection('categories');
      const usersCollection = db.collection('users');

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 25;
      const rawCategoryType = req.query.categoryType as string;
      const categoryTypeFilter = ['expense', 'income'].includes(rawCategoryType)
        ? { categoryType: rawCategoryType }
        : {};

      const rawSort = req.query.sort;
      const sortDirection =
        rawSort === 'asc' || rawSort === 'desc' ? rawSort : 'asc';

      const skip = (page - 1) * pageSize;
      const sort = sortDirection === 'desc' ? -1 : 1;

      // Return hiddenCategories from user lookup
      const currentUser = await usersCollection.findOne(
        { _id: new ObjectId(currentUserId) },
        { projection: { hiddenCategories: 1 } }
      );

      const userHiddenCategories = currentUser.hiddenCategories || [];

      // Lookup stages based on category type
      let lookupStages: any[] = [];

      if (rawCategoryType === 'expense') {
        lookupStages.push({
          $lookup: {
            from: 'expenses',
            let: { categoryId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$categoryId', '$$categoryId'] },
                  userId: new ObjectId(currentUserId),
                },
              },
              { $count: 'numMatchedItems' },
            ],
            as: 'itemCount',
          },
        });
      } else if (rawCategoryType === 'income') {
        lookupStages.push({
          $lookup: {
            from: 'income',
            let: { categoryId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$categoryId', '$$categoryId'] },
                  userId: new ObjectId(currentUserId),
                },
              },
              { $count: 'numMatchedItems' },
            ],
            as: 'itemCount',
          },
        });
      } else {
        // No categoryType specified – look up both expenses and incomes and sum them
        lookupStages.push(
          {
            $lookup: {
              from: 'expenses',
              let: { categoryId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$categoryId', '$$categoryId'] },
                    userId: new ObjectId(currentUserId),
                  },
                },
                { $count: 'count' },
              ],
              as: 'expenseCount',
            },
          },
          {
            $lookup: {
              from: 'income',
              let: { categoryId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$categoryId', '$$categoryId'] },
                    userId: new ObjectId(currentUserId),
                  },
                },
                { $count: 'count' },
              ],
              as: 'incomeCount',
            },
          },
          {
            $addFields: {
              numMatchedItems: {
                $add: [
                  {
                    $ifNull: [{ $arrayElemAt: ['$expenseCount.count', 0] }, 0],
                  },
                  { $ifNull: [{ $arrayElemAt: ['$incomeCount.count', 0] }, 0] },
                ],
              },
            },
          }
        );
      }

      const result = await categoriesCollection
        .aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    { userId: new ObjectId(currentUserId) },
                    { userId: new ObjectId('000000000000000000000000') },
                  ],
                },
                categoryTypeFilter,
              ],
            },
          },
          {
            $match: { _id: { $nin: userHiddenCategories } },
          },
          ...lookupStages,
          {
            $addFields: {
              categoryNameLower: { $toLower: '$categoryName' },
              ...(rawCategoryType
                ? {
                    numMatchedItems: {
                      $ifNull: [
                        { $arrayElemAt: ['$itemCount.numMatchedItems', 0] },
                        0,
                      ],
                    },
                  }
                : {}),
            },
          },
          {
            $sort: { categoryNameLower: sort },
          },
          {
            $project: {
              _id: 1,
              categoryName: 1,
              icon: 1,
              categoryType: 1,
              userId: 1,
              numMatchedItems: 1,
            },
          },
          {
            $facet: {
              categories: [{ $skip: skip }, { $limit: pageSize }],
              totalCount: [{ $count: 'count' }],
            },
          },
        ])
        .toArray();

      const categories = result[0].categories;
      const total = result[0].totalCount[0]?.count || 0;

      const mappedCategories = categories.map((category: Category) => ({
        _id: category._id,
        categoryName: category.categoryName,
        icon: category.icon,
        categoryType: category.categoryType,
        userId: category.userId,
        numMatchedItems: category.numMatchedItems,
      }));

      res.status(200).json({
        categoryList: mappedCategories,
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

// Add category to current user (auth)
// POST /api/categories
router.post(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const { categoryName, icon, categoryType } = req.body;
    if (
      !categoryType ||
      (categoryType !== 'expense' && categoryType !== 'income')
    ) {
      return res.status(400).json({
        error: 'Category type must be either "expense" or "income"',
      });
    }
    if (!categoryName) {
      return res.status(400).json({
        error: 'Category name is required',
      });
    }
    if (!validateSingleEmoji(icon)) {
      return res.status(400).json({
        error: 'Invalid emoji',
      });
    }
    try {
      const db = await connectDB();
      const categoriesCollection = db.collection('categories');

      // Create new category object
      const newCategory = {
        categoryName,
        icon,
        categoryType,
        userId: new ObjectId(currentUserId),
      };

      // Insert category into the database
      await categoriesCollection.insertOne(newCategory);

      res.status(201).json({
        message: 'Category added successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Update category field(s) by ID (auth)
// PATCH /api/categories/:id
router.patch(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const categoryId = req.params.id;
    const updateFields = req.body; // Only include fields that need updating

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Define the allowed fields for update
    const allowedFields = ['categoryName', 'icon'];

    // Filter out any fields that are not part of the schema
    const filteredUpdates = Object.fromEntries(
      Object.entries(updateFields).filter(([key]) =>
        allowedFields.includes(key)
      )
    );
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    if (
      typeof filteredUpdates.icon === 'string' &&
      !validateSingleEmoji(filteredUpdates.icon)
    ) {
      return res.status(400).json({
        error: 'Invalid emoji',
      });
    }
    try {
      const db = await connectDB();
      const categoriesCollection = db.collection('categories');

      // Fetch the current category
      const currentCategory = await categoriesCollection.findOne({
        _id: new ObjectId(categoryId),
      });

      if (!currentCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Check if the category is a default category (userId = "000000000000000000000000")
      if (
        currentCategory.userId.equals(new ObjectId('000000000000000000000000'))
      ) {
        // Create new category object to prevent changing default category
        const newCategory = {
          categoryName: filteredUpdates.categoryName,
          icon: filteredUpdates.icon,
          categoryType: currentCategory.categoryType,
          userId: new ObjectId(currentUserId),
        };

        // Insert new category into the categories database table
        const insertedCategory = await categoriesCollection.insertOne(
          newCategory
        );

        // Update userId hidden categories (hide old default category that's being updated)
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          {
            $addToSet: { hiddenCategories: new ObjectId(categoryId) }, // Ensures no duplicates
          }
        );

        // Update all user expenses OR income items from the old default categoryId to the new categoryId
        if (newCategory.categoryType == 'expense') {
          const expensesCollection = db.collection('expenses');
          await expensesCollection.updateMany(
            {
              userId: new ObjectId(currentUserId),
              categoryId: new ObjectId(categoryId), // Update only expenses with the old categoryId
            },
            {
              $set: { categoryId: insertedCategory.insertedId }, // Assign the new categoryId
            }
          );
        } else if (newCategory.categoryType == 'income') {
          const incomeCollection = db.collection('income');
          await incomeCollection.updateMany(
            {
              userId: new ObjectId(currentUserId),
              categoryId: new ObjectId(categoryId), // Update only expenses with the old categoryId
            },
            {
              $set: { categoryId: insertedCategory.insertedId }, // Assign the new categoryId
            }
          );
        }
        res.status(200).json({
          message:
            'Category updated successfully (new category created to prevent overwriting default category)',
        });
      } else {
        // Update category fields by categoryId in the database (user category)
        await categoriesCollection.updateOne(
          { _id: new ObjectId(categoryId) },
          { $set: filteredUpdates } // Only updates the fields provided
        );
        res.status(200).json({
          message: 'User category updated successfully',
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete multiple categories (auth)
// POST /api/categories/delete
router.post(
  '/delete',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const { ids } = req.body;
    if (
      !ids ||
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => ObjectId.isValid(id))
    ) {
      return res
        .status(400)
        .json({ error: 'Provide an array of valid category IDs' });
    }

    try {
      const db = await connectDB();
      const categoriesCollection = db.collection('categories');
      const usersCollection = db.collection('users');

      // Map ids to ObjectIds and separate them by default and user categories
      const categoryObjectIdMap = ids.map((id) => new ObjectId(id));

      const categoriesToBeDeleted = await categoriesCollection
        .find({
          _id: { $in: categoryObjectIdMap },
        })
        .toArray();

      if (categoriesToBeDeleted.length === 0) {
        return res.status(404).json({ error: 'No categories found' });
      }

      const defaultCategoryIds = categoriesToBeDeleted
        .filter((category: Category) =>
          new ObjectId(category.userId).equals(
            new ObjectId('000000000000000000000000')
          )
        )
        .map((category: Category) => category._id);

      const userCategoryIds = categoriesToBeDeleted
        .filter(
          (category: Category) =>
            !new ObjectId(category.userId).equals(
              new ObjectId('000000000000000000000000')
            )
        )
        .map((category: Category) => category._id);

      // Add default categories to current user's hiddenCategories instead of deleting them
      if (defaultCategoryIds.length > 0) {
        await usersCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $addToSet: { hiddenCategories: { $each: defaultCategoryIds } } }
        );
      }

      // Delete category if it's a user-created category
      if (userCategoryIds.length > 0) {
        await categoriesCollection.deleteMany({
          _id: { $in: userCategoryIds },
        });
      }

      // Reset all user expenses OR income items with the old categories to "no category" (based on first category in list)
      if (categoriesToBeDeleted[0].categoryType == 'expense') {
        const expensesCollection = db.collection('expenses');
        await expensesCollection.updateMany(
          {
            userId: new ObjectId(currentUserId),
            categoryId: { $in: categoryObjectIdMap }, // Update only user expenses with the deleted categoryId(s)
          },
          {
            $set: { categoryId: new ObjectId('000000000000000000000000') }, // Assign the empty categoryId
          }
        );
      } else if (categoriesToBeDeleted[0].categoryType == 'income') {
        const incomeCollection = db.collection('income');
        await incomeCollection.updateMany(
          {
            userId: new ObjectId(currentUserId),
            categoryId: { $in: categoryObjectIdMap }, // Update only user expenses with the deleted categoryId(s)
          },
          {
            $set: { categoryId: new ObjectId('000000000000000000000000') }, // Assign the empty categoryId
          }
        );
      }

      res.status(200).json({
        message: 'Deleted categories successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Restore default categories (auth)
// POST /api/categories/restore
router.post(
  '/restore',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;

    try {
      const db = await connectDB();
      const usersCollection = db.collection('users');

      // Set hiddenCategories to an empty array to "restore defaults"
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(currentUserId) },
        { $set: { hiddenCategories: [] } }
      );

      if (result.modifiedCount === 0) {
        return res
          .status(304)
          .json({ message: 'Default categories already restored' });
      }

      res.status(200).json({
        message: 'Default categories restored successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Delete category by ID (auth) - UNUSED!
// DELETE /api/categories/:id
router.delete(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentUserId = req.user.userId;
    const categoryId = req.params.id;
    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
      const db = await connectDB();
      const categoriesCollection = db.collection('categories');
      const usersCollection = db.collection('users');

      const categoryToDelete = await categoriesCollection.findOne({
        _id: new ObjectId(categoryId),
      });

      if (!categoryToDelete) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const isDefaultCategory = new ObjectId(categoryToDelete.userId).equals(
        new ObjectId('000000000000000000000000')
      );

      if (isDefaultCategory) {
        // Hide default category instead of deleting
        await usersCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $addToSet: { hiddenCategories: new ObjectId(categoryId) } }
        );
      } else {
        // Delete category if it's a user-created category
        await categoriesCollection.deleteOne({ _id: new ObjectId(categoryId) });
      }

      // Reset all user expenses OR income items with the old category to "no category"
      if (categoryToDelete.categoryType == 'expense') {
        const expensesCollection = db.collection('expenses');
        await expensesCollection.updateMany(
          {
            userId: new ObjectId(currentUserId),
            categoryId: new ObjectId(categoryId),
          },
          {
            $set: { categoryId: new ObjectId('000000000000000000000000') },
          }
        );
      } else if (categoryToDelete.categoryType == 'income') {
        const incomeCollection = db.collection('income');
        await incomeCollection.updateMany(
          {
            userId: new ObjectId(currentUserId),
            categoryId: new ObjectId(categoryId),
          },
          {
            $set: { categoryId: new ObjectId('000000000000000000000000') },
          }
        );
      }

      res.status(200).json({
        message: 'Category deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

module.exports = router;
