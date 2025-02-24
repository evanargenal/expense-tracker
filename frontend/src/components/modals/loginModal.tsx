import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import styles from './LoginModal.module.css';

function LoginModal() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const toggleLoginPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    handleClearForm();
    setIsLoginPage(!isLoginPage);
  };
  const handleClose = () => {
    setShowLoginModal(false);
    handleClearForm();
    setIsLoginPage(true);
  };
  const handleShow = () => {
    setIsLoginPage(true);
    setShowLoginModal(true);
  };
  const handleClearForm = () => {
    setFormFullName('');
    setFormEmail('');
    setFormPassword('');
  };

  const handleFormFullNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormFullName(event.target.value);
  };
  const handleFormEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormEmail(event.target.value);
  };
  const handleFormPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormPassword(event.target.value);
  };

  const handleLogin = (formEmail: string, formPassword: string) => {
    axios
      .post('/api/auth/login', {
        email: formEmail,
        password: formPassword,
      })
      .then((response) => {
        console.log('User logged in successfully');
        setUser(response.data);
        handleClose();
        navigate('dashboard');
      })
      .catch((error) => {
        console.error('Error logging in user:', error);
      });
  };

  const handleSignUp = (
    formFullName: string,
    formEmail: string,
    formPassword: string
  ) => {
    axios
      .post('/api/auth/register', {
        fullName: formFullName,
        email: formEmail,
        password: formPassword,
        isAdmin: false,
      })
      .then((response) => {
        console.log('User registered successfully');
        setUser(response.data);
        handleClose();
        navigate('dashboard');
      })
      .catch((error) => {
        console.error('Error signing up user:', error);
      });
  };

  const handleLogout = () => {
    axios
      .get('/api/auth/logout')
      .then(() => {
        console.log('User logged out successfully');
        setUser(null);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging user out: ', error);
      });
  };

  return (
    <>
      <Button
        className={styles.loginButton}
        variant="primary"
        onClick={!user ? handleShow : handleLogout}
      >
        {!user ? 'Log In' : 'Log Out'}
      </Button>
      <Modal show={showLoginModal} onHide={handleClose}>
        <Modal.Header className={styles.modalHeader}>
          <Modal.Title>{isLoginPage ? 'Log In' : 'Sign Up'}</Modal.Title>
          <CloseButton
            className={styles.modalXButton}
            onClick={handleClose}
          ></CloseButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {!isLoginPage && (
              <Form.Group style={{ paddingBottom: '10px' }}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="fullName"
                  onChange={handleFormFullNameChange}
                  value={formFullName}
                  autoFocus
                />
              </Form.Group>
            )}
            <Form.Group style={{ paddingBottom: '10px' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleFormEmailChange}
                value={formEmail}
                autoFocus
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleFormPasswordChange}
                value={formPassword}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-grid" style={{ justifyContent: 'unset' }}>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            onClick={() =>
              isLoginPage
                ? handleLogin(formEmail, formPassword)
                : handleSignUp(formFullName, formEmail, formPassword)
            }
          >
            {isLoginPage ? 'Log In' : 'Sign Up'}
          </Button>
          <div className={styles.footerText}>
            <p>
              {isLoginPage
                ? "New around here? I think it's time you "
                : 'Been here before? Maybe you should '}
              <a href="/#" role="button" onClick={toggleLoginPage}>
                {isLoginPage ? 'sign up!' : 'log in!'}
              </a>
            </p>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
