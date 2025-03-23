import { useState, useEffect, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import {
  getExpenses,
  getCategories,
  addExpense,
  editExpense,
  deleteExpenses,
} from '../../services/expenseService';
import ExpensesTableHeader from './ExpensesTableHeader';
import NoExpensesMessage from './NoExpensesMessage';
import NewExpenseTableForm from './NewExpenseTableForm';
import ExpenseRow from './ExpenseRow';
import { ExpenseItem, Category } from '../../types/types';
import { getEmptyExpenseItem } from '../../utils/expenseUtils';

import styles from './TableStyle.module.css';

function ExpensesTable() {
  const emptyExpenseForm = getEmptyExpenseItem();

  const [userExpenses, setUserExpenses] = useState<ExpenseItem[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newExpenseMode, setNewExpenseMode] = useState(false);
  const [newExpense, setNewExpense] = useState<ExpenseItem>(emptyExpenseForm);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [editExpenseMode, setEditExpenseMode] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<ExpenseItem>(emptyExpenseForm);

  const toggleEditMode = () => {
    setEditExpenseMode(!editExpenseMode);
    setEditingExpense(emptyExpenseForm);
    setSelectedExpenses([]);
  };

  const toggleNewExpenseMode = () => {
    setNewExpenseMode(!newExpenseMode);
    setNewExpense(emptyExpenseForm);
  };

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

  const fetchUserExpenses = useCallback(async () => {
    try {
      const data = await getExpenses();
      getUserCategories();
      setUserExpenses(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving expenses for user:', error);
    }
  }, []);

  const getUserCategories = async () => {
    try {
      const data = await getCategories();
      setUserCategories(data);
    } catch (error) {
      console.error('Error retrieving expenses for user:', error);
    }
  };

  useEffect(() => {
    fetchUserExpenses();
  }, [fetchUserExpenses]);

  const handleAddExpense = async (newExpense: ExpenseItem) => {
    try {
      await addExpense(
        newExpense.name,
        newExpense.description,
        Number(newExpense.cost),
        newExpense.date,
        newExpense.categoryName
      );
      toggleNewExpenseMode();
      fetchUserExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (editingExpense: ExpenseItem) => {
    try {
      // Ensure cost is a number and date is a proper Date object
      const sanitizedExpense = {
        ...editingExpense,
        cost: editingExpense.cost ? Number(editingExpense.cost) : undefined, // Convert cost to number
        date: editingExpense.date ? new Date(editingExpense.date) : undefined, // Ensure date is a Date
      };
      await editExpense(editingExpense._id, sanitizedExpense);
      setEditingExpense(emptyExpenseForm); // Exit edit mode
      fetchUserExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async (ids: string | string[]) => {
    // Convert a single ID into an array if necessary
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (
      !window.confirm(
        `Are you sure you want to delete ${
          idsArray.length === 1
            ? 'this expense'
            : `these ${idsArray.length} expenses`
        }?`
      )
    )
      return;

    try {
      await deleteExpenses(idsArray);
      fetchUserExpenses();
    } catch (error) {
      console.error('Failed to delete expense(s):', error);
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
          <NewExpenseTableForm
            newExpense={newExpense}
            userCategories={userCategories}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            selectedExpenses={selectedExpenses}
            handleSelect={handleSelect}
          />
        )}
      </>
    );
  };

  const sortedExpenses = userExpenses.sort(
    (a: { date: Date }, b: { date: Date }): number =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const renderSortedExpenseRows = () => {
    return (
      <>
        <ExpensesTableHeader
          newExpenseMode={newExpenseMode}
          toggleNewExpenseMode={toggleNewExpenseMode}
          editExpenseMode={editExpenseMode}
          toggleEditMode={toggleEditMode}
          selectedExpenses={selectedExpenses}
          handleDelete={() => handleDelete(selectedExpenses)}
          fetchUserExpenses={fetchUserExpenses}
        />
        {newExpenseMode && ( // Add new expense form
          <NewExpenseTableForm
            newExpense={newExpense}
            userCategories={userCategories}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            selectedExpenses={selectedExpenses}
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
                <th>
                  <Form.Check
                    aria-label="select all"
                    className={styles.customCheck}
                    checked={selectedExpenses.length === userExpenses.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th>Date</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Cost</th>
              {editExpenseMode && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {sortedExpenses?.map((expense) => (
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
              <th colSpan={editExpenseMode ? 2 : 1} className="text-end">
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
