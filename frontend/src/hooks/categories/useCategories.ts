import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/types';

export function useCategories(
  pageNumber: number,
  itemsPerPage: number,
  sortDirection: string
) {
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [userCategoryTotal, setUserCategoryTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserCategories = useCallback(async () => {
    try {
      const data = await getCategories(pageNumber, itemsPerPage, sortDirection);
      setUserCategories(data.categoryList);
      setUserCategoryTotal(data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving categories:', error);
    }
  }, [pageNumber, itemsPerPage, sortDirection]);

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  return {
    userCategories,
    userCategoryTotal,
    isLoading,
    fetchUserCategories,
  };
}
