import React, { useState } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import logo from './assets/logo.svg';
import Header from './components/header/index';

function App() {
  // const [nameFromLogin, setNameFromLogin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleDataFromLoginModal(response) {
    setIsLoggedIn(response.isLoggedIn);
    // setNameFromLogin(response.name);
  }

  const handleTestAuth = () => {
    const token = localStorage.getItem('token');

    axios
      .get('/api/auth/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Token is valid, welcome to the protected route!');
        console.log(response.data.user.userId);
      })
      .catch((error) => {
        console.error('Error with token check', error);
      });
  };

  return (
    <div className="App">
      <div className="App-header">
        <Header sendUserDataToParent={handleDataFromLoginModal} />
      </div>
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        {!isLoggedIn ? (
          <p>Log in to see your name!</p>
        ) : (
          <p>Congrats, you logged in!</p>
        )}
        {/* <Button size="md" onClick={handleTestAuth}>
          Test Token
        </Button> */}
      </div>
    </div>
  );
}

export default App;
