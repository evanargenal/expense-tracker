import { useState, useEffect, useCallback } from 'react';
import { getIncomeItems } from '../../services/incomeService';
import { getCategories } from '../../services/categoryService';
import { IncomeItem, Category } from '../../types/types';

export function useIncomeItems(
  pageNumber: number,
  itemsPerPage: number,
  sortDirection: string
) {
  const [userIncomeItems, setUserIncomeItems] = useState<IncomeItem[]>([]);
  const [userIncomeItemTotal, setUserIncomeItemTotal] = useState(0);
  const [userIncomeCategories, setUserIncomeCategories] = useState<Category[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserIncomeItems = useCallback(async () => {
    try {
      const data = await getIncomeItems(
        pageNumber,
        itemsPerPage,
        sortDirection
      );
      getUserIncomeCategories();
      setUserIncomeItems(data.incomeList);
      setUserIncomeItemTotal(data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving income items:', error);
    }
  }, [pageNumber, itemsPerPage, sortDirection]);

  const getUserIncomeCategories = async () => {
    try {
      const data = await getCategories(1, 1000, 'asc', 'income');
      setUserIncomeCategories(data.categoryList);
    } catch (error) {
      console.error('Error retrieving categories:', error);
    }
  };

  useEffect(() => {
    fetchUserIncomeItems();
  }, [fetchUserIncomeItems]);

  return {
    userIncomeItems,
    userIncomeItemTotal,
    userIncomeCategories,
    isLoading,
    fetchUserIncomeItems,
  };
}
