// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// import axios from 'axios';

// import Button from 'react-bootstrap/Button';

import './pages.css';
import Header from '../components/header/Header';
import TableExpenses from '../components/tables/ExpensesTable';

function Dashboard() {
  // const { user } = useAuth();
  // const [userExpenses, setUserExpenses] = useState({});

  // const handleTestAuth = () => {
  //   axios
  //     .get('/api/auth/validate', { withCredentials: true })
  //     .then((response) => {
  //       console.log('Token is valid!');
  //       console.log(
  //         'User ID of current user logged in: ',
  //         response.data.user.userId
  //       );
  //       console.log('response.data for testAuth: ', response.data);
  //       console.log('authContext user is: ', user);
  //     })
  //     .catch((error) => {
  //       console.error('Error with token check', error);
  //     });
  //   axios
  //     .get('/api/expenses', { withCredentials: true })
  //     .then((response) => {
  //       console.log('List of expenses for current user: ', response.data);
  //       setUserExpenses(response.data);
  //       console.log(userExpenses);
  //     })
  //     .catch((error) => {
  //       console.error('Error with getting expenses for user', error);
  //     });
  // };

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className="tableExpenses">
            <TableExpenses></TableExpenses>
          </div>
          <p className="mb-2">
            Congrats, you logged in! Here are your expenses!
          </p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
