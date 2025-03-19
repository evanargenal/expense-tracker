import { ObjectId, Collection } from 'mongodb';

export const getCategoryIdByName = async (
  categoryName: string,
  categoriesCollection: Collection
) => {
  if (!categoryName) return new ObjectId('000000000000000000000000'); // No category name provided

  const category = await categoriesCollection.findOne({ categoryName });

  return category ? category._id : new ObjectId('000000000000000000000000'); // Default category ID
};
