import { useState } from 'react';
import Header from '../../components/header/Header';
import ExpensesTableHeader from '../../components/tables/expenses/ExpensesTableHeader';
import ExpensesTable from '../../components/tables/expenses/ExpensesTable';
import PageControls from '../../components/pagination/PageControls';

import { useExpensesWithActions } from '../../hooks/expenses/useExpensesWithActions';

import './../../styles/shared.css';
import styles from './ExpensesList.module.css';

function ExpensesList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const {
    userExpenses,
    userExpenseTotal,
    userExpenseCategories,
    isLoading,
    fetchUserExpenses,
    newExpenseMode,
    newExpense,
    editExpenseMode,
    editingExpense,
    selectedExpenses,
    toggleNewExpenseMode,
    toggleEditMode,
    setEditingExpense,
    setSelectedExpenses,
    handleAddExpense,
    handleEditExpense,
    handleUpdateMultipleExpenseCategories,
    handleDelete,
  } = useExpensesWithActions(pageNumber, itemsPerPage, sortDirection);

  return (
    <>
      <div className="app">
        <div className="app-header">
          <Header />
        </div>
        <div className="app-body">
          <div className={styles['expenses-list__container']}>
            {!isLoading && (
              <ExpensesTableHeader
                itemTotal={userExpenses.length}
                userExpenseCategories={userExpenseCategories}
                fetchUserExpenses={fetchUserExpenses}
                newExpenseMode={newExpenseMode}
                editExpenseMode={editExpenseMode}
                selectedExpenses={selectedExpenses}
                toggleNewExpenseMode={toggleNewExpenseMode}
                toggleEditMode={toggleEditMode}
                handleDelete={handleDelete}
                handleUpdateMultipleExpenseCategories={
                  handleUpdateMultipleExpenseCategories
                }
              />
            )}
            <div className={styles['expenses-list__table']}>
              <ExpensesTable
                userExpenses={userExpenses}
                userExpenseCategories={userExpenseCategories}
                isLoading={isLoading}
                newExpenseMode={newExpenseMode}
                newExpense={newExpense}
                editExpenseMode={editExpenseMode}
                editingExpense={editingExpense}
                selectedExpenses={selectedExpenses}
                toggleNewExpenseMode={toggleNewExpenseMode}
                setEditingExpense={setEditingExpense}
                setSelectedExpenses={setSelectedExpenses}
                handleAddExpense={handleAddExpense}
                handleEditExpense={handleEditExpense}
                handleDelete={handleDelete}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              ></ExpensesTable>
            </div>
            {userExpenses.length !== 0 && (
              <PageControls
                itemTotal={userExpenseTotal}
                pageNumber={pageNumber}
                itemsPerPage={itemsPerPage}
                itemsPerPageArray={[25, 50, 100]}
                setPageNumber={setPageNumber}
                setItemsPerPage={setItemsPerPage}
              ></PageControls>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpensesList;
