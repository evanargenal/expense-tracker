import { useState, useEffect } from 'react';
import { getExpenses, deleteExpense } from '../../services/expenseService';

import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Trash, Pencil } from 'react-bootstrap-icons';

import styles from './ExpensesTable.module.css';

function ExpensesTable() {
  interface ExpenseItem {
    _id: string;
    categoryName: string;
    cost: number;
    date: Date;
    description: string;
    icon: string;
    name: string;
    userId: string;
  }

  const [userExpenses, setUserExpenses] = useState<ExpenseItem[]>([]);
  const [userExpenseTotal, setUserExpenseTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserExpenses = async () => {
      try {
        const data = await getExpenses();
        setIsLoading(false);
        setUserExpenses(data);
        setUserExpenseTotal(
          data
            .reduce(
              (total: number, item: ExpenseItem) => total + (item.cost || 0),
              0
            )
            .toFixed(2)
        );
      } catch (error) {
        console.error('Error retrieving expenses for user:', error);
      }
    };

    fetchUserExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?'))
      return;
    try {
      await deleteExpense(id);
      setUserExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const renderSortedExpenseRows = () => {
    if (userExpenses.length === 0) {
      return (
        <p className="mb-4">
          No expenses found for your account. <br></br>
          Either you're a liar or you need to add some!
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
          <Button variant="success" size="lg">
            +
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
                <td className="text-end">${(item.cost || 0).toFixed(2)}</td>
                <td>
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
                </td>
              </tr>
            ))}
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
