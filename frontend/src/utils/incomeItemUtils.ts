import { IncomeItem } from '../types/types';

export const getEmptyIncomeItem = (): IncomeItem => ({
  _id: '',
  name: '',
  description: '',
  amount: '',
  date: new Date(new Date().setHours(0, 0, 0, 0)),
  userId: '',
  categoryId: '',
  categoryName: '',
  icon: '',
});
