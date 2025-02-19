import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';

import axios from 'axios';

import Table from 'react-bootstrap/Table';

import './style.css';

function ExpensesTable() {
  const { setLoading } = useAuth();
  const [userExpenses, setUserExpenses] = useState([]);
  const [userExpenseTotal, setUserExpenseTotal] = useState(0);

  useEffect(() => {
    const fetchUserExpenses = async () => {
      try {
        const { data } = await axios.get('/api/expenses', {
          withCredentials: true,
        });
        setUserExpenses(data);
        setUserExpenseTotal(
          data
            .reduce((total, item) => total + Number(item.cost || 0), 0)
            .toFixed(2)
        );
      } catch (error) {
        console.error('Error retrieving expenses for user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserExpenses();
  }, [setLoading]);

  const renderSortedExpenseRows = () => {
    const sortedExpenses = userExpenses.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return sortedExpenses?.map((item, index) => (
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
        <td className="text-end">${(Number(item.cost) || 0).toFixed(2)}</td>
      </tr>
    ));
  };

  return (
    <>
      {userExpenses.length !== 0 ? (
        <Table striped bordered responsive variant="dark">
          <thead>
            <tr>
              <th>Expense #</th>
              <th>Date</th>
              <th>Expense Name</th>
              <th>Description</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {renderSortedExpenseRows()}
            <tr>
              <th colSpan={4}>Total</th>
              <th className="text-end">${userExpenseTotal}</th>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p className="mb-4">
          No expenses found for your account. <br></br>
          Either you're a liar or you need to add some!
        </p>
      )}
    </>
  );
}

export default ExpensesTable;
