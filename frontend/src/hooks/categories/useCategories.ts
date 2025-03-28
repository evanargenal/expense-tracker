import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/types';

export function useCategories() {
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setUserCategories(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  return {
    userCategories,
    isLoading,
    fetchUserCategories,
  };
}
