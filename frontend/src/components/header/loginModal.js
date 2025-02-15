import { useState } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import './style.css';

function LoginModal({ sendDataToParent }) {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleLoginPage = (event) => {
    handleClear();
    setIsLoginPage(!isLoginPage);
  };
  const handleClose = () => {
    setShowLoginModal(false);
    handleClear();
    setIsLoginPage(true);
  };
  const handleShow = () => {
    setIsLoginPage(true);
    setShowLoginModal(true);
  };
  const handleClear = () => {
    setFullName('');
    setEmail('');
    setPassword('');
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
    console.log('Logging in with this form data: ', email, password);
    axios
      .post('/api/auth/login', {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log('User logged in successfully');
        // Store JWT token
        localStorage.setItem('token', response.data.token);
        sendDataToParent(response.data);
        handleClose();
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  const handleSignUp = (fullName, email, password) => {
    setFullName(fullName);
    setEmail(email);
    setPassword(password);
    console.log('Signing up with this form data: ', fullName, email, password);
    axios
      .post('/api/auth/register', {
        fullName: fullName,
        email: email,
        password: password,
        isAdmin: false,
      })
      .then((response) => {
        console.log('User registered successfully');
        localStorage.setItem('token', response.data.token);
        sendDataToParent(response.data);
        handleClose();
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  return (
    <>
      <Button
        className="Login-button"
        variant="primary"
        size="lg"
        onClick={handleShow}
      >
        Log In
      </Button>

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
                  onChange={handleFullNameChange}
                  value={fullName}
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
                onChange={handleEmailChange}
                value={email}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="passwordForm">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handlePasswordChange}
                value={password}
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
              onClick={() => handleLogin(email, password)}
            >
              Log In
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              type="submit"
              onClick={() => handleSignUp(fullName, email, password)}
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
