import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import './style.css';

function LoginModal() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const toggleLoginPage = (event) => {
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

  const handleFormFullNameChange = (event) => {
    setFormFullName(event.target.value);
  };
  const handleFormEmailChange = (event) => {
    setFormEmail(event.target.value);
  };
  const handleFormPasswordChange = (event) => {
    setFormPassword(event.target.value);
  };

  const handleLogin = (formEmail, formPassword) => {
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
        console.error('Error fetching user:', error);
      });
  };

  const handleSignUp = (formFullName, formEmail, formPassword) => {
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
      .post('/api/auth/logout')
      .then(() => {
        console.log('User logged out successfully');
        setUser(null);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing up user:', error);
      });
  };

  return (
    <>
      {!user ? (
        <Button
          className="Login-button"
          variant="primary"
          size="lg"
          onClick={handleShow}
        >
          Log In
        </Button>
      ) : (
        <Button
          className="Login-button"
          variant="primary"
          size="lg"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      )}
      <Modal show={showLoginModal} onHide={handleClose}>
        <Modal.Header className="loginHeader">
          <Modal.Title>{isLoginPage ? 'Log In' : 'Sign Up'}</Modal.Title>
          <CloseButton
            className="modalCloseButton"
            onClick={handleClose}
          ></CloseButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {!isLoginPage && (
              <Form.Group
                className="nameForm"
                style={{ paddingBottom: '10px' }}
              >
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
            <Form.Group className="emailForm" style={{ paddingBottom: '10px' }}>
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
            <Form.Group className="passwordForm">
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
          {isLoginPage ? (
            <Button
              variant="primary"
              size="lg"
              type="submit"
              onClick={() => handleLogin(formEmail, formPassword)}
            >
              Log In
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              type="submit"
              onClick={() =>
                handleSignUp(formFullName, formEmail, formPassword)
              }
            >
              Sign Up
            </Button>
          )}
          {isLoginPage ? (
            <div
              className="footerLogInSignUpText"
              style={{
                paddingTop: '5px',
              }}
            >
              <p style={{ margin: 0 }}>
                New around here? I think it's time you{' '}
                <Button
                  variant="link"
                  onClick={toggleLoginPage}
                  style={{
                    padding: 0,
                    paddingBottom: '3px',
                    textDecoration: 'none',
                  }}
                >
                  sign up
                </Button>
              </p>
            </div>
          ) : (
            <div
              className="footerLogInSignUpText"
              style={{
                paddingTop: '5px',
              }}
            >
              <p style={{ margin: 0 }}>
                Been here before? Maybe you should{' '}
                <Button
                  variant="link"
                  onClick={toggleLoginPage}
                  style={{
                    padding: 0,
                    paddingBottom: '3px',
                    textDecoration: 'none',
                  }}
                >
                  log in
                </Button>
              </p>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
