import { Category } from '../types/types';

export const getEmptyCategoryItem = (): Category => ({
  _id: '',
  categoryName: '',
  icon: '',
  categoryType: '',
  userId: '',
  numExpenses: '',
});
