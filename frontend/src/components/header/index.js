import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import LoginModal from './loginModal';

function Header({ updateApp }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    updateApp(user);
  }, [user, updateApp]);

  return (
    <div className="headerContainer">
      {user.fullName && (
        <p>
          Logged in as: {user.fullName}! {user.isAdmin && '(You are an admin!)'}
        </p>
      )}
      <LoginModal setUser={setUser} />
    </div>
  );
}

export default Header;
