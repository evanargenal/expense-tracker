export interface AuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

export interface ExpenseItem {
  _id: string;
  categoryName: string;
  cost: string;
  date: Date;
  description: string;
  icon: string;
  name: string;
  userId: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  icon: string;
  userId: string;
}
