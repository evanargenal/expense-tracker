// import React, { useState } from 'react';

// import axios from 'axios';

// import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import logo from './assets/logo.svg';
import Header from './components/header/index';

//data will be the string we send from our server
// const apiCall = () => {
//   axios.get('/').then((data) => {
//     //this console.log will be in our frontend console
//     console.log(data);
//   });
// };

function App() {
  // const [userName, setUserName] = useState('');
  // const [isVisible, setIsVisible] = useState(false);

  // const getUsers = () => {
  //   axios.get('/api/users').then((response) => {
  //     setIsVisible(!isVisible);
  //     setUserName(response.data[0].name);
  //   });
  // };

  return (
    <div className="App">
      <div className="App-header">
        <Header />
      </div>
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <Button variant="primary" size="lg" onClick={getUsers}>
          Display your name
        </Button> */}
        <p>Log in to see your name!</p>
      </div>
    </div>
  );
}

export default App;
