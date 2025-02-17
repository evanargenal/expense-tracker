import React, { useState } from 'react';

// import axios from 'axios';

// import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import logo from './assets/logo.svg';
import Header from './components/header/index';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleDataFromLoginModal(user) {
    setIsLoggedIn(user.fullName ? true : false);
  }

  // const handleTestAuth = () => {
  //   axios
  //     .get('/api/auth/validate', { withCredentials: true })
  //     .then((response) => {
  //       console.log('Token is valid!');
  //       console.log(
  //         'User ID of current user logged in: ',
  //         response.data.user.userId
  //       );
  //     })
  //     .catch((error) => {
  //       console.error('Error with token check', error);
  //     });
  // };

  return (
    <div className="App">
      <div className="App-header">
        <Header updateApp={handleDataFromLoginModal} />
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
