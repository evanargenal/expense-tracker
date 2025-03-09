import { useState, useEffect, useCallback } from 'react';
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from '../../services/expenseService';

import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  Trash,
  Pencil,
  PlusLg,
  XLg,
  CheckLg,
  ArrowClockwise,
} from 'react-bootstrap-icons';

import styles from './ExpensesTable.module.css';

function ExpensesTable() {
  interface ExpenseItem {
    _id: string;
    categoryName: string;
    cost: string; // Converts to number before submitting API call
    date: Date;
    description: string;
    icon: string;
    name: string;
    userId: string;
  }

  const [userExpenses, setUserExpenses] = useState<ExpenseItem[]>([]);
  const [userExpenseTotal, setUserExpenseTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [newExpenseMode, setNewExpenseMode] = useState(false);

  const emptyNewExpenseForm: ExpenseItem = {
    _id: '',
    categoryName: '',
    cost: '',
    date: new Date(new Date().setHours(0, 0, 0, 0)), // Set today's date at midnight in local timezone
    description: '',
    icon: '',
    name: '',
    userId: '',
  };
  const [newExpense, setNewExpense] =
    useState<ExpenseItem>(emptyNewExpenseForm);

  const toggleNewExpenseMode = () => {
    setNewExpenseMode(!newExpenseMode);
    setNewExpense(emptyNewExpenseForm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpense((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'date'
          ? e.target.value === ''
            ? ''
            : new Date(
                new Date(e.target.value).toLocaleString('en-US', {
                  timeZone: 'UTC',
                })
              ) // Adjust to local time zone offset
          : e.target.value,
    }));
  };

  const fetchUserExpenses = useCallback(async () => {
    try {
      const data = await getExpenses();
      setIsLoading(false);
      setUserExpenses(data);
      setUserExpenseTotal(
        data
          .reduce(
            (total: number, item: ExpenseItem) =>
              total + (Number(item.cost) || 0),
            0
          )
          .toFixed(2)
      );
    } catch (error) {
      console.error('Error retrieving expenses for user:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserExpenses();
  }, [fetchUserExpenses]);

  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.cost) {
      alert('Name and cost are required!');
      return;
    }

    const expenseToAdd: ExpenseItem = {
      ...newExpense,
      _id: Date.now().toString(), // Temporary ID until saved in the database
      date: newExpense.date ? new Date(newExpense.date) : new Date(), // Ensure it's a Date object
      cost: newExpense.cost,
      userId: '', // Set userId (will be assigned during API call)
      icon: '', // Ensure icon has a default value (will be pulled from API call)
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?'))
      return;
    try {
      await deleteExpense(id);
      setUserExpenses((prevExpenses) => {
        const updatedExpenses = prevExpenses.filter(
          (expense) => expense._id !== id
        );
        fetchUserExpenses();
        return updatedExpenses;
      });
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const renderSortedExpenseRows = () => {
    if (userExpenses.length === 0) {
      return (
        <p className="mb-4">
          No expenses found for your account. <br></br>
          Either you're a liar or you need to add some! <br></br> <br></br>
          <Button variant="success" size="lg" onClick={toggleNewExpenseMode}>
            Add Expense <PlusLg className="mb-1" />
          </Button>
        </p>
      );
    }
    const sortedExpenses = userExpenses.sort(
      (a: { date: Date }, b: { date: Date }): number =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return (
      <div>
        <div className={styles.bodyHeader}>
          <Button variant="success" size="lg" onClick={toggleNewExpenseMode}>
            <PlusLg className="mb-1" />
          </Button>
          <Button variant="secondary" size="lg" onClick={fetchUserExpenses}>
            <ArrowClockwise className="mb-1" />
          </Button>
        </div>
        <Table
          className={styles.expensesTable}
          striped
          responsive
          variant="dark"
          size="sm"
        >
          <thead>
            <tr>
              <th>
                <Form.Check
                  aria-label="option 1"
                  className={styles.customCheck}
                />
              </th>
              <th>Date</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses?.map((item) => (
              <tr key={item._id}>
                <td>
                  <Form.Check
                    aria-label="option 1"
                    className={styles.customCheck}
                  />
                </td>
                <td>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  {item.categoryName} {item.icon}
                </td>
                <td className="text-end">
                  ${(Number(item.cost) || 0).toFixed(2)}
                </td>
                <td>
                  <div className={styles.actionItems}>
                    <Button variant="secondary" size="sm">
                      <Pencil />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {newExpenseMode ? (
              <>
                <tr>
                  <td></td>
                  <td>
                    <Form.Control
                      type="date"
                      name="date"
                      value={
                        newExpense.date instanceof Date
                          ? newExpense.date.toLocaleDateString('en-CA') // Localized to YYYY-MM-DD
                          : ''
                      }
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={newExpense.name}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={newExpense.description}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="categoryName"
                      placeholder="Category"
                      value={newExpense.categoryName}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      value={newExpense.cost}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleAddExpense}
                    >
                      <CheckLg />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={toggleNewExpenseMode}
                    >
                      <XLg />
                    </Button>
                  </td>
                </tr>
              </>
            ) : (
              <></>
            )}
            <tr>
              <th colSpan={5}>Total</th>
              <th colSpan={1} className="text-end">
                ${userExpenseTotal}
              </th>
              <th colSpan={1}></th>
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
