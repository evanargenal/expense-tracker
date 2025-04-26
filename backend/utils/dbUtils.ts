import { ObjectId, Collection } from 'mongodb';

export const verifyCategoryId = async (
  categoryId: string,
  categoriesCollection: Collection
) => {
  if (!categoryId || categoryId === '000000000000000000000000') {
    return new ObjectId('000000000000000000000000'); // No category name provided
  }

  const category = await categoriesCollection.findOne({
    _id: new ObjectId(categoryId),
  });

  return category ? category._id : new ObjectId('000000000000000000000000'); // Default category ID
};
