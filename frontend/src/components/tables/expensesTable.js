import { useState, useEffect } from 'react';

import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';

import './style.css';

function ExpensesTable() {
  const [userExpenses, setUserExpenses] = useState([]);
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
        console.log(data);
        setUserExpenseTotal(
          data
            .reduce((total, item) => total + Number(item.cost || 0), 0)
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
      (a, b) => new Date(a.date) - new Date(b.date)
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
                  hour: 'numeric',
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
        // REDO THIS PART, MAKE CONTAINER OUTSIDE OF EXPENSESTABLE.JS SO PLACEHOLDERS/SPACING IS UNIFORM FOR THE PLACEHOLDERS AND THEH TABLE!!
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
