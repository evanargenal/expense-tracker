import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import ExpensesTableHeader from './ExpensesTableHeader';
import NoExpensesMessage from './NoExpensesMessage';
import ExpenseTableNewForm from './ExpenseTableNewForm';
import ExpenseRow from './ExpenseRow';
import { useExpenseActions } from '../../../hooks/expenses/useExpenseActions';
import { ExpenseItem, Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface ExpensesTableProps {
  userExpenses: ExpenseItem[];
  userCategories: Category[];
  isLoading: boolean;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  fetchUserExpenses: () => Promise<void>;
}

function ExpensesTable({
  userExpenses,
  userCategories,
  isLoading,
  sortDirection,
  setSortDirection,
  fetchUserExpenses,
}: ExpensesTableProps) {
  const {
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
  } = useExpenseActions(fetchUserExpenses);

  const toggleSortOrder = () =>
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));

  const handleSelect = (id: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === userExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(userExpenses.map((expense) => expense._id));
    }
  };

  const renderNoExpenses = () => {
    return (
      <>
        <NoExpensesMessage
          newExpenseMode={newExpenseMode}
          toggleNewExpenseMode={toggleNewExpenseMode}
        />
        {newExpenseMode && (
          <ExpenseTableNewForm
            newExpense={newExpense}
            userCategories={userCategories}
            selectedExpenses={selectedExpenses}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            handleSelect={handleSelect}
          />
        )}
      </>
    );
  };

  const renderSortedExpenseRows = () => {
    return (
      <>
        <ExpensesTableHeader
          newExpenseMode={newExpenseMode}
          editExpenseMode={editExpenseMode}
          selectedExpenses={selectedExpenses}
          userCategories={userCategories}
          toggleNewExpenseMode={toggleNewExpenseMode}
          toggleEditMode={toggleEditMode}
          handleDelete={() => handleDelete(selectedExpenses)}
          handleUpdateMultipleExpenseCategories={
            handleUpdateMultipleExpenseCategories
          }
          fetchUserExpenses={fetchUserExpenses}
        />
        {newExpenseMode && ( // Add new expense form
          <ExpenseTableNewForm
            newExpense={newExpense}
            userCategories={userCategories}
            selectedExpenses={selectedExpenses}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            handleSelect={handleSelect}
          />
        )}
        <Table
          className={styles.expensesTable}
          striped
          responsive
          variant="dark"
        >
          <thead>
            <tr>
              {editExpenseMode && (
                <th style={{ width: '5%' }}>
                  <Form.Check
                    aria-label="select all"
                    className={styles.customCheck}
                    checked={selectedExpenses.length === userExpenses.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th
                style={{ width: '20%', cursor: 'pointer' }}
                onClick={toggleSortOrder}
              >
                <div className={styles.itemsWithIcons}>
                  <span>Date</span>
                  {sortDirection === 'desc' ? (
                    <CaretDownFill />
                  ) : (
                    <CaretUpFill />
                  )}
                </div>
              </th>
              <th style={{ width: '15%' }}>Name</th>
              <th style={{ width: '15%' }}>Description</th>
              <th style={{ width: '20%' }}>Category</th>
              <th style={{ width: '10%' }}>Cost</th>
              {editExpenseMode && (
                <th className="text-center" style={{ width: '10%' }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {userExpenses?.map((expense) => (
              <ExpenseRow
                key={expense._id}
                expense={expense}
                isEditing={editingExpense._id === expense._id}
                editExpenseMode={editExpenseMode}
                selectedExpenses={selectedExpenses}
                userCategories={userCategories}
                setEditingExpense={setEditingExpense}
                handleDelete={handleDelete}
                handleSelect={handleSelect}
                handleEditExpense={handleEditExpense} // Pass handleAddExpense for ExpenseForm
              />
            ))}
            <tr>
              <th colSpan={editExpenseMode ? 5 : 4}>Total</th>
              <th colSpan={editExpenseMode ? 2 : 1}>
                $
                {userExpenses
                  .reduce((total, item) => total + Number(item.cost), 0)
                  .toFixed(2)}
              </th>
            </tr>
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        userExpenses.length === 0 ? (
          renderNoExpenses()
        ) : (
          renderSortedExpenseRows()
        )
      ) : (
        <div className="mb-4">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={12} />
            <Placeholder xs={12} />
            <Placeholder xs={12} />
          </Placeholder>
        </div>
      )}
    </>
  );
}

export default ExpensesTable;
