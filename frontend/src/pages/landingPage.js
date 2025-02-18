import { useAuth } from '../context/authContext';

import axios from 'axios';

import Button from 'react-bootstrap/Button';

import './pages.css';
import logo from '../assets/logo.svg';
import Header from '../components/header/index';

function LandingPage() {
  const { user } = useAuth();

  const handleTestAuth = () => {
    axios
      .get('/api/auth/validate', { withCredentials: true })
      .then((response) => {
        console.log('Token is valid!');
        console.log(
          'User ID of current user logged in: ',
          response.data.user.userId
        );
        console.log('response.data is: ', response.data);
        console.log('authContext user is: ', user);
      })
      .catch((error) => {
        console.error('Error with token check', error);
      });
  };

  return (
    <div className="App">
      <div className="App-header">
        <Header />
      </div>
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Log in to see your name!</p>
        <Button size="md" onClick={handleTestAuth}>
          Test Token
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;
