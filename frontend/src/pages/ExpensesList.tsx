import { useState } from 'react';
import Header from '../components/header/Header';
import ExpensesTable from '../components/tables/expenses/ExpensesTable';
import PageControls from '../components/pagination/PageControls';

import { useExpenses } from '../hooks/expenses/useExpenses';

import './pages.css';
import styles from './ExpensesList.module.css';

function ExpensesList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const expenses = useExpenses(pageNumber, itemsPerPage, sortDirection);

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.tableExpensesContainer}>
            <ExpensesTable
              userExpenses={expenses.userExpenses}
              userCategories={expenses.userCategories}
              isLoading={expenses.isLoading}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              fetchUserExpenses={expenses.fetchUserExpenses}
            ></ExpensesTable>
          </div>
          {expenses.userExpenses.length !== 0 && (
            <div className={styles.paginationContainer}>
              <PageControls
                itemTotal={expenses.userExpenseTotal}
                pageNumber={pageNumber}
                itemsPerPage={itemsPerPage}
                setPageNumber={setPageNumber}
                setItemsPerPage={setItemsPerPage}
              ></PageControls>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ExpensesList;
