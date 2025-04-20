export interface AuthenticatedUser {
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

export interface Category {
  _id: string;
  categoryName: string;
  icon: string;
  userId: string;
  numExpenses: string;
}
