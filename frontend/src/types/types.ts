export interface User {
  userId: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

export interface ExpenseItem {
  _id: string;
  name: string;
  description: string;
  cost: string;
  date: Date;
  userId: string;
  categoryId: string;
  categoryName: string;
  icon: string;
}

export interface IncomeItem {
  _id: string;
  name: string;
  description: string;
  amount: string;
  date: Date;
  userId: string;
  categoryId: string;
  categoryName: string;
  icon: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  icon: string;
  categoryType: string;
  userId: string;
  numMatchedItems: string;
}

export interface FormData {
  fullName: string;
  email: string;
  password: string;
}
