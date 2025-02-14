import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import LoginModal from './loginModal';

function Header() {
  const [nameFromLogin, setNameFromLogin] = useState('');

  function handleDataFromChild(name) {
    setNameFromLogin(name);
  }

  return (
    <div className="headerContainer">
      {nameFromLogin && <p>Welcome back, {nameFromLogin}!</p>}
      <LoginModal sendDataToParent={handleDataFromChild} />
    </div>
  );
}

export default Header;
