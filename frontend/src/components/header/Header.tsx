import { useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/auth/useLogout';

import LoginModal from '../modals/LoginModal';
import TabNavigation from '../tabs/TabNavigation';

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { ShieldCheck, CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import styles from './Header.module.css';

function Header() {
  const { user } = useAuth();
  const handleLogout = useLogout();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);

  const toggleShowDropdownMenu = () => {
    setShowDropdownMenu(!showDropdownMenu);
  };

  const handleShow = () => setShowLoginModal(true);
  const handleClose = () => setShowLoginModal(false);

  return (
    <>
      <div className={styles.headerContainer}>
        {user && (
          <>
            <div className={styles.tabContainer}>
              <TabNavigation />
            </div>
          </>
        )}
      </div>
      {user ? (
        <div className={styles.ProfileButtonContainer}>
          <Dropdown
            data-bs-theme="dark"
            align="end"
            onToggle={toggleShowDropdownMenu}
          >
            <Dropdown.Toggle id="profileDropdown">
              {user.isAdmin && <ShieldCheck className="mb-1" />} {user.fullName}{' '}
              {showDropdownMenu ? (
                <CaretUpFill className="mb-1" />
              ) : (
                <CaretDownFill className="mb-1" />
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <div className={styles.logInButtonContainer}>
          <Button onClick={handleShow}>Log In</Button>
          <LoginModal show={showLoginModal} handleClose={handleClose} />
        </div>
      )}
    </>
  );
}

export default Header;
