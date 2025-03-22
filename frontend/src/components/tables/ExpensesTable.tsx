import { useState, useEffect, useCallback } from 'react';
import {
  getExpenses,
  getCategories,
  addExpense,
  editExpense,
  deleteExpenses,
} from '../../services/expenseService';
import ExpenseForm from './ExpenseForm';
import ExpensesTableHeader from './ExpensesTableHeader';
import { ExpenseItem, Category } from '../../types/types';

import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Trash, Pencil, PlusLg, DashLg } from 'react-bootstrap-icons';

import styles from './ExpensesTable.module.css';

function ExpensesTable() {
  const emptyExpenseForm: ExpenseItem = {
    _id: '',
    categoryName: '',
    cost: '',
    date: new Date(new Date().setHours(0, 0, 0, 0)), // Set today's date at midnight in local timezone
    description: '',
    icon: '',
    name: '',
    userId: '',
  };

  const [userExpenses, setUserExpenses] = useState<ExpenseItem[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newExpenseMode, setNewExpenseMode] = useState(false);
  const [newExpense, setNewExpense] = useState<ExpenseItem>(emptyExpenseForm);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [editingExpense, setEditingExpense] =
    useState<ExpenseItem>(emptyExpenseForm);
  const [editExpenseMode, setEditExpenseMode] = useState(false);

  const toggleEditMode = () => {
    setEditExpenseMode(!editExpenseMode);
    setEditingExpense(emptyExpenseForm);
    setSelectedExpenses([]);
  };

  const toggleNewExpenseMode = () => {
    setNewExpenseMode(!newExpenseMode);
    setNewExpense(emptyExpenseForm);
  };

  // Toggle selection for a specific expense
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
    const expenseToAdd: ExpenseItem = {
      ...newExpense,
      _id: Date.now().toString(), // Temporary ID until saved in the database
      date: newExpense.date ? new Date(newExpense.date) : new Date(), // Ensure it's a Date object
      cost: newExpense.cost,
    };

    try {
      const response = await addExpense(
        newExpense.name,
        newExpense.description,
        Number(newExpense.cost),
        newExpense.date,
        newExpense.categoryName
      );

      if (response.status < 200 || response.status >= 300)
        throw new Error('Failed to add expense');

      setUserExpenses((prev) => [...prev, expenseToAdd]); // Add to state
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

      // Remove deleted expenses from userExpenses and selectedExpenses arrays
      setUserExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => !idsArray.includes(expense._id))
      );
      setSelectedExpenses((prevSelected) =>
        prevSelected.filter((id) => !idsArray.includes(id))
      );

      fetchUserExpenses();
    } catch (error) {
      console.error('Failed to delete expense(s):', error);
    }
  };

  const renderSortedExpenseRows = () => {
    if (userExpenses.length === 0) {
      return (
        <>
          <p className="mb-4 mt-5">
            No expenses found for your account. <br></br>
            Either you're a liar or you need to add some! <br></br> <br></br>
            <Button
              variant={newExpenseMode ? 'secondary' : 'success'}
              size="lg"
              onClick={toggleNewExpenseMode}
            >
              Add Expense{' '}
              {newExpenseMode ? (
                <DashLg className="mb-1" />
              ) : (
                <PlusLg className="mb-1" />
              )}
            </Button>
          </p>
          {newExpenseMode && (
            <Table
              className={styles.expensesTable}
              responsive
              striped
              variant="dark"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Confirm?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <ExpenseForm
                    expense={newExpense}
                    userCategories={userCategories}
                    onSave={handleAddExpense}
                    onCancel={toggleNewExpenseMode}
                    isEditing={false}
                    selectedExpenses={selectedExpenses}
                    onSelect={handleSelect}
                  />
                </tr>
              </tbody>
            </Table>
          )}
        </>
      );
    }
    const sortedExpenses = userExpenses.sort(
      (a: { date: Date }, b: { date: Date }): number =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return (
      <div>
        <ExpensesTableHeader
          newExpenseMode={newExpenseMode}
          toggleNewExpenseMode={toggleNewExpenseMode}
          editExpenseMode={editExpenseMode}
          toggleEditMode={toggleEditMode}
          selectedExpenses={selectedExpenses}
          handleDelete={() => handleDelete(selectedExpenses)}
          fetchUserExpenses={fetchUserExpenses}
        />
        {newExpenseMode && (
          <Table
            className={styles.expensesTable}
            responsive
            striped
            variant="dark"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Confirm?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <ExpenseForm
                  expense={newExpense}
                  userCategories={userCategories}
                  onSave={handleAddExpense}
                  onCancel={toggleNewExpenseMode}
                  isEditing={false}
                  selectedExpenses={selectedExpenses}
                  onSelect={handleSelect}
                />
              </tr>
            </tbody>
          </Table>
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
              <tr key={expense._id}>
                {editingExpense._id === expense._id ? (
                  <ExpenseForm
                    expense={editingExpense}
                    userCategories={userCategories}
                    onSave={handleEditExpense}
                    onCancel={() => setEditingExpense(emptyExpenseForm)}
                    isEditing={true}
                    selectedExpenses={selectedExpenses}
                    onSelect={handleSelect}
                  />
                ) : (
                  <>
                    {editExpenseMode && (
                      <td>
                        <Form.Check
                          aria-label="select"
                          className={styles.customCheck}
                          checked={selectedExpenses.includes(expense._id)}
                          onChange={() => handleSelect(expense._id)}
                        />
                      </td>
                    )}
                    <td>
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td>{expense.name}</td>
                    <td>{expense.description}</td>
                    <td>
                      {expense.categoryName} {expense.icon}
                    </td>
                    <td className="text-end">
                      ${Number(expense.cost).toFixed(2)}
                    </td>
                    {editExpenseMode && (
                      <td>
                        <div className={styles.actionItems}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingExpense(expense)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(expense._id)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
            <tr>
              {editExpenseMode && <th colSpan={1}></th>}
              <th colSpan={4}>Total</th>
              <th colSpan={1} className="text-end">
                $
                {userExpenses
                  .reduce((total, item) => total + Number(item.cost), 0)
                  .toFixed(2)}
              </th>
              {editExpenseMode && <th colSpan={1}></th>}
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <>
      {!isLoading ? (
        renderSortedExpenseRows()
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
