import { useCategories } from './useCategories';
import { useCategoryActions } from './useCategoryActions';

export function useCategoriesWithActions(
  pageNumber: number,
  itemsPerPage: number,
  sortDirection: 'asc' | 'desc',
  categoryType: string
) {
  const categories = useCategories(
    pageNumber,
    itemsPerPage,
    sortDirection,
    categoryType
  );
  const actions = useCategoryActions(
    categories.fetchUserCategories,
    () => categories.userCategories.length
  );

  return {
    ...categories,
    ...actions,
  };
}
