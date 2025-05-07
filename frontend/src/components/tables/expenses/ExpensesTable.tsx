import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import ExpenseTableNewForm from './ExpenseTableNewForm';
import ExpenseRow from './ExpenseRow';
import { ExpenseItem, Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface ExpensesTableProps {
  userExpenses: ExpenseItem[];
  userExpenseCategories: Category[];
  isLoading: boolean;
  newExpenseMode: boolean;
  newExpense: ExpenseItem;
  editExpenseMode: boolean;
  editingExpense: ExpenseItem;
  selectedExpenses: string[];
  toggleNewExpenseMode: () => void;
  setEditingExpense: (expense: ExpenseItem) => void;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<string[]>>;
  handleAddExpense: (expense: ExpenseItem) => Promise<void>;
  handleEditExpense: (expense: ExpenseItem) => Promise<void>;
  handleDelete: (expenseId: string | string[]) => Promise<void>;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

function ExpensesTable({
  userExpenses,
  userExpenseCategories,
  isLoading,
  newExpenseMode,
  newExpense,
  editExpenseMode,
  editingExpense,
  selectedExpenses,
  toggleNewExpenseMode,
  setEditingExpense,
  setSelectedExpenses,
  handleAddExpense,
  handleEditExpense,
  handleDelete,
  sortDirection,
  setSortDirection,
}: ExpensesTableProps) {
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
        {newExpenseMode && (
          <ExpenseTableNewForm
            newExpense={newExpense}
            userExpenseCategories={userExpenseCategories}
            selectedExpenses={selectedExpenses}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            handleSelect={handleSelect}
          />
        )}
        <h3 className={newExpenseMode ? '' : 'mt-2'}>
          No expenses found for your account. <br />
          Either you're a liar or you need to add some! <br /> <br />
        </h3>
      </>
    );
  };

  const renderSortedExpenseRows = () => {
    return (
      <>
        {newExpenseMode && ( // Add new expense form
          <ExpenseTableNewForm
            newExpense={newExpense}
            userExpenseCategories={userExpenseCategories}
            selectedExpenses={selectedExpenses}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            handleSelect={handleSelect}
          />
        )}
        <Table
          className={styles.tableStyling}
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
                userExpenseCategories={userExpenseCategories}
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
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
          </Placeholder>
        </div>
      )}
    </>
  );
}

export default ExpensesTable;
