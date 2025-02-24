import { useState, useEffect } from 'react';

import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';

import './style.css';

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
        const { data } = await axios.get('/api/expenses', {
          withCredentials: true,
        });
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
        console.error('Error retrieving expenses for user', error);
      }
    };

    fetchUserExpenses();
  }, []);

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
      <Table striped bordered responsive variant="dark" size="sm">
        <thead>
          <tr>
            <th>Expense #</th>
            <th>Date</th>
            <th>Expense Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses?.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
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
            </tr>
          ))}
          <tr>
            <th colSpan={5}>Total</th>
            <th className="text-end">${userExpenseTotal}</th>
          </tr>
        </tbody>
      </Table>
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
