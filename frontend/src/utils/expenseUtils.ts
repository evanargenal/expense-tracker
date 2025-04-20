import { ExpenseItem } from '../types/types';

export const getEmptyExpenseItem = (): ExpenseItem => ({
  _id: '',
  name: '',
  description: '',
  cost: '',
  date: new Date(new Date().setHours(0, 0, 0, 0)),
  userId: '',
  categoryId: '',
  categoryName: '',
  icon: '',
});
