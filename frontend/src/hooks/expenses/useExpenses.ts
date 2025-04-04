import { useState, useEffect, useCallback } from 'react';
import { getExpenses } from '../../services/expenseService';
import { getCategories } from '../../services/categoryService';
import { ExpenseItem, Category } from '../../types/types';

export function useExpenses() {
  const [userExpenses, setUserExpenses] = useState<ExpenseItem[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserExpenses = useCallback(async () => {
    try {
      const data = await getExpenses();
      getUserCategories();
      setUserExpenses(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving expenses:', error);
    }
  }, []);

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
    userCategories,
    isLoading,
    fetchUserExpenses,
    getUserCategories,
  };
}
