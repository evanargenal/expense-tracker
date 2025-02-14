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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const toggleLoginPage = (event) => {
    handleClear();
    setIsLoginPage(!isLoginPage);
  };
  const handleClose = () => setShowLoginModal(false);
  const handleShow = () => {
    setShowLoginModal(true);
    setIsLoginPage(true);
  };
  const handleClear = () => {
    setFormData({ fullName: '', email: '', password: '' });
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

  const handleLogin = (formData) => {
    setFormData({ email: email, password: password });
    axios
      .get(`/api/users/${formData.email}`)
      .then((response) => {
        // console.log(formData);
        // console.log(response.data);
        if (response.data === null) {
          console.log('User not found');
          return;
        }
        if (response.data.password === formData.password) {
          console.log('Login successful');
          // console.log('Name:', response.data.name);
          sendDataToParent(response.data.name);
          handleClose();
        } else {
          console.log('Login failed');
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  const handleSignUp = (formData) => {
    setFormData({ fullName: fullName, email: email, password: password });
    console.log(
      'signing up with this form data (May not be fully up to date)',
      formData
    );
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
              onClick={() => handleLogin(formData)}
            >
              Log In
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              type="submit"
              onClick={() => handleSignUp(formData)}
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
