import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import LoginModal from './loginModal';

function Header() {
  const [dataFromChild, setDataFromChild] = useState('');

  function handleDataFromChild(data) {
    setDataFromChild(data);
  }

  return (
    <div className="headerContainer">
      {dataFromChild && <p>Welcome back, {dataFromChild}!</p>}
      <LoginModal sendDataToParent={handleDataFromChild} />
    </div>
  );
}

export default Header;
