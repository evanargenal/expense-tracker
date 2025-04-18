import { useState, useEffect, useCallback } from 'react';
import { getExpenses } from '../../services/expenseService';
import { getCategories } from '../../services/categoryService';
import { ExpenseItem, Category } from '../../types/types';

export function useExpenses(
  pageNumber: number,
  itemsPerPage: number,
  sortDirection: string
) {
  const [userExpenses, setUserExpenses] = useState<ExpenseItem[]>([]);
  const [userExpenseTotal, setUserExpenseTotal] = useState(0);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserExpenses = useCallback(async () => {
    try {
      const data = await getExpenses(pageNumber, itemsPerPage, sortDirection);
      getUserCategories();
      setUserExpenses(data.expenseList);
      setUserExpenseTotal(data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving expenses:', error);
    }
  }, [pageNumber, itemsPerPage, sortDirection]);

  const getUserCategories = async () => {
    try {
      const data = await getCategories();
      setUserCategories(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving categories:', error);
    }
  };

  useEffect(() => {
    fetchUserExpenses();
  }, [fetchUserExpenses]);

  return {
    userExpenses,
    userExpenseTotal,
    userCategories,
    isLoading,
    fetchUserExpenses,
    getUserCategories,
  };
}
