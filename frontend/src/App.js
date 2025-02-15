import React, { useState } from 'react';

// import axios from 'axios';

// import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import logo from './assets/logo.svg';
import Header from './components/header/index';

function App() {
  const [nameFromLogin, setNameFromLogin] = useState('');

  function handleDataFromLoginModal(response) {
    setNameFromLogin(response.name);
  }

  return (
    <div className="App">
      <div className="App-header">
        <Header sendUserDataToParent={handleDataFromLoginModal} />
      </div>
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <Button variant="primary" size="lg" onClick={getUsers}>
          Display your name
        </Button> */}
        {!nameFromLogin ? (
          <p>Log in to see your name!</p>
        ) : (
          <p>Congrats, you logged in!</p>
        )}
      </div>
    </div>
  );
}

export default App;
