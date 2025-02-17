import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import LoginModal from './loginModal';

function Header({ sendUserDataToParent }) {
  const [nameFromLogin, setNameFromLogin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function handleDataFromChild(response) {
    setIsLoggedIn(response.isLoggedIn);
    sendUserDataToParent(response);
    setNameFromLogin(response.name);
    setIsAdmin(response.isAdmin);
  }

  return (
    <div className="headerContainer">
      {isLoggedIn && (
        <p>
          Logged in as: {nameFromLogin}! {isAdmin && '(You are an admin!)'}
        </p>
      )}
      <LoginModal sendDataToParent={handleDataFromChild} />
    </div>
  );
}

export default Header;
