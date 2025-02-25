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
  const [validated, setValidated] = useState(false);
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
    setValidated(false);
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

  const handleLogin = (
    formEmail: string,
    formPassword: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
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
    formPassword: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
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
          <Form
            noValidate
            validated={validated}
            onSubmit={(event) =>
              isLoginPage
                ? handleLogin(formEmail, formPassword, event)
                : handleSignUp(formFullName, formEmail, formPassword, event)
            }
          >
            {!isLoginPage && (
              <Form.Group style={{ paddingBottom: '10px' }}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Name"
                  name="fullName"
                  onChange={handleFormFullNameChange}
                  value={formFullName}
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your name.
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group style={{ paddingBottom: '10px' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleFormEmailChange}
                value={formEmail}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleFormPasswordChange}
                value={formPassword}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a password.
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" size="lg" type="submit">
                {isLoginPage ? 'Log In' : 'Sign Up'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-grid" style={{ justifyContent: 'unset' }}>
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
