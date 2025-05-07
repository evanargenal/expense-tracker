import { useExpenses } from './useExpenses';
import { useExpenseActions } from './useExpenseActions';

export function useExpensesWithActions(
  pageNumber: number,
  itemsPerPage: number,
  sortDirection: 'asc' | 'desc'
) {
  const expenses = useExpenses(pageNumber, itemsPerPage, sortDirection);
  const actions = useExpenseActions(
    expenses.fetchUserExpenses,
    () => expenses.userExpenses.length
  );

  return {
    ...expenses,
    ...actions,
  };
}
