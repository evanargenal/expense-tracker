import { ExpenseItem } from '../types/types';

export const getEmptyExpenseItem = (): ExpenseItem => ({
  _id: '',
  categoryName: '',
  cost: '',
  date: new Date(new Date().setHours(0, 0, 0, 0)),
  description: '',
  icon: '',
  name: '',
  userId: '',
});
