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
          <div className={styles['table--margin-bottom']}>
            <ExpenseTableNewForm
              newExpense={newExpense}
              userExpenseCategories={userExpenseCategories}
              selectedExpenses={selectedExpenses}
              handleAddExpense={handleAddExpense}
              toggleNewExpenseMode={toggleNewExpenseMode}
              handleSelect={handleSelect}
            />
          </div>
        )}
        <div className={styles['table__scroll-container']}>
          <Table
            className={styles['table__layout']}
            striped
            responsive
            data-bs-theme="dark"
          >
            <thead>
              <tr>
                {editExpenseMode && (
                  <th className={styles['table__custom-check-container']}>
                    <Form.Check
                      aria-label="select all"
                      className={styles['table__custom-check']}
                      checked={selectedExpenses.length === userExpenses.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th style={{ cursor: 'pointer' }} onClick={toggleSortOrder}>
                  <div className={styles['table__items-with-icons']}>
                    <span>Date</span>
                    {sortDirection === 'desc' ? (
                      <CaretDownFill />
                    ) : (
                      <CaretUpFill />
                    )}
                  </div>
                </th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Cost</th>
                {editExpenseMode && (
                  <th className={styles['table__action-items-container']}>
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={styles['table__body-scroll']}>
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
                  handleEditExpense={handleEditExpense}
                />
              ))}
            </tbody>
            <tfoot className={styles['table__footer']}>
              <tr>
                <th
                  colSpan={4}
                  style={{
                    textAlign: 'left',
                    paddingLeft: '0.5rem',
                  }}
                >
                  {' '}
                  Total
                </th>
                {editExpenseMode && (
                  <th className={styles['table__custom-check-container']}></th>
                )}
                <th
                  style={{
                    textAlign: 'left',
                  }}
                >
                  $
                  {userExpenses
                    .reduce((total, item) => total + Number(item.cost), 0)
                    .toFixed(2)}
                </th>
                {editExpenseMode && (
                  <th className={styles['table__action-items-container']}></th>
                )}
              </tr>
            </tfoot>
          </Table>
        </div>
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
