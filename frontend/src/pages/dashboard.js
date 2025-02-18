import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Button from 'react-bootstrap/Button';

import './pages.css';
import logo from '../assets/logo.svg';
import Header from '../components/header/index';

function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]); // Runs when `user` changes

  const handleTestAuth = () => {
    axios
      .get('/api/auth/validate', { withCredentials: true })
      .then((response) => {
        console.log('Token is valid!');
        console.log(
          'User ID of current user logged in: ',
          response.data.user.userId
        );
        console.log('authContext user is: ', user);
      })
      .catch((error) => {
        console.error('Error with token check', error);
      });
  };

  return (
    <div className="App">
      <div className="App-header">
        <Header updateApp={setUser} />
      </div>
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Congrats, you logged in!</p>
        <Button size="md" onClick={handleTestAuth}>
          Test Token
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
