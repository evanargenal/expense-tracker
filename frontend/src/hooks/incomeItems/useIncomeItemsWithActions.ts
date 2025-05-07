import { useIncomeItems } from './useIncomeItems';
import { useIncomeItemActions } from './useIncomeItemActions';

export function useIncomeItemsWithActions(
  pageNumber: number,
  itemsPerPage: number,
  sortDirection: 'asc' | 'desc'
) {
  const incomeItems = useIncomeItems(pageNumber, itemsPerPage, sortDirection);
  const actions = useIncomeItemActions(
    incomeItems.fetchUserIncomeItems,
    () => incomeItems.userIncomeItems.length
  );

  return {
    ...incomeItems,
    ...actions,
  };
}
