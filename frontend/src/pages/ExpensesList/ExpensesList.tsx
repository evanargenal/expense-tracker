import { useState } from 'react';
import Header from '../../components/header/Header';
import ExpensesTableHeader from '../../components/tables/expenses/ExpensesTableHeader';
import ExpensesTable from '../../components/tables/expenses/ExpensesTable';
import PageControls from '../../components/pagination/PageControls';

import { useExpenses } from '../../hooks/expenses/useExpenses';
import { useExpenseActions } from '../../hooks/expenses/useExpenseActions';

import './../../styles/shared.css';
import styles from './ExpensesList.module.css';

function ExpensesList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const expenses = useExpenses(pageNumber, itemsPerPage, sortDirection);
  const expenseActions = useExpenseActions(expenses.fetchUserExpenses);

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.expenseParentContainer}>
            {expenses.userExpenses.length !== 0 && (
              <ExpensesTableHeader
                userExpenseCategories={expenses.userExpenseCategories}
                expenseActions={expenseActions}
                fetchUserExpenses={expenses.fetchUserExpenses}
              />
            )}
            <div className={styles.tableExpensesContainer}>
              <ExpensesTable
                userExpenses={expenses.userExpenses}
                userExpenseCategories={expenses.userExpenseCategories}
                isLoading={expenses.isLoading}
                sortDirection={sortDirection}
                expenseActions={expenseActions}
                setSortDirection={setSortDirection}
              ></ExpensesTable>
            </div>
            {expenses.userExpenses.length !== 0 && (
              <div className={styles.paginationContainer}>
                <PageControls
                  itemTotal={expenses.userExpenseTotal}
                  pageNumber={pageNumber}
                  itemsPerPage={itemsPerPage}
                  itemsPerPageArray={[25, 50, 100]}
                  setPageNumber={setPageNumber}
                  setItemsPerPage={setItemsPerPage}
                ></PageControls>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpensesList;
