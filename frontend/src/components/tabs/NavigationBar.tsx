import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import LoginLogo from '../../assets/loginLogo.png';

import styles from './NavigationBar.module.css';

function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabKey, setTabKey] = useState('expenses-list');

  useEffect(() => {
    // Map URL path to corresponding tab key
    if (location.pathname === '/expenses-list') {
      setTabKey('expenses-list');
    } else if (location.pathname === '/income-list') {
      setTabKey('income-list');
    } else if (location.pathname === '/categories-list') {
      setTabKey('categories-list');
    }
  }, [location.pathname]);

  const handleSelect = (k: string | null) => {
    if (k) {
      setTabKey(k);
      navigate(`/${k}`); // Navigate to the selected route
    }
  };

  return (
    <Navbar
      expand="md"
      data-bs-theme="dark"
      className={styles['navbar-no-padding']}
    >
      <Navbar.Toggle />
      <Navbar.Offcanvas data-bs-theme="dark">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={LoginLogo} className={styles['navbar-logo']} alt="logo" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav
            activeKey={tabKey}
            onSelect={handleSelect}
            className="nav-underline"
          >
            <Nav.Link
              eventKey="expenses-list"
              href="/expenses-list"
              className={`${styles['nav-link']} ${
                tabKey === 'expenses-list' ? styles['nav-link-active'] : ''
              }`}
            >
              Expenses
            </Nav.Link>
            <Nav.Link
              eventKey="income-list"
              href="/income-list"
              className={`${styles['nav-link']} ${
                tabKey === 'income-list' ? styles['nav-link-active'] : ''
              }`}
            >
              Income
            </Nav.Link>
            <Nav.Link
              eventKey="categories-list"
              href="/categories-list"
              className={`${styles['nav-link']} ${
                tabKey === 'categories-list' ? styles['nav-link-active'] : ''
              }`}
            >
              Categories
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  );
}

export default TabNavigation;
