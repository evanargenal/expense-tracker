import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  loginUser,
  registerUser,
  logoutUser,
} from '../../services/authService';
import { FormData } from '../../types/types';

import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import styles from './LoginModal.module.css';

function LoginModal() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [validated, setValidated] = useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const emptyFormData: FormData = { fullName: '', email: '', password: '' };
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsInvalidCredentials(false);
  };

  const toggleLoginPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    clearForm();
    setIsLoginPage(!isLoginPage);
  };
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const handleShow = () => {
    clearForm();
    setIsLoginPage(true);
    setShowLoginModal(true);
  };
  const clearForm = () => {
    setValidated(false);
    setIsInvalidCredentials(false);
    setFormErrorMessage('');
    setFormData(emptyFormData);
  };

  const handleSubmit = async (
    formData: FormData,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      setValidated(true);
      event.stopPropagation();
      return;
    }
    try {
      const response = isLoginPage
        ? await loginUser(formData.email, formData.password)
        : await registerUser(
            formData.fullName,
            formData.email,
            formData.password
          );
      console.log(
        isLoginPage
          ? 'User logged in successfully'
          : 'User registered successfully'
      );
      setUser(response.data);
      handleClose();
      navigate('/dashboard');
    } catch (error: any) {
      console.error(
        `Error ${isLoginPage ? 'logging in' : 'signing up'}:`,
        error
      );
      switch (error.response?.data?.message) {
        case 'User does not exist':
          setFormErrorMessage(
            'No email found. Please check your email or sign up.'
          );
          break;
        case 'Invalid credentials':
          setFormErrorMessage('Incorrect email or password. Please try again.');
          break;
        case 'User already exists':
          setFormErrorMessage(
            'An account with this email already exists. Try logging in.'
          );
          break;
        default:
          setFormErrorMessage(
            'An unexpected error occurred. Please try again later.'
          );
      }
      setValidated(false);
      setIsInvalidCredentials(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('User logged out successfully');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging user out:', error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={!user ? handleShow : handleLogout}>
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
            onSubmit={(event) => handleSubmit(formData, event)}
          >
            {!isLoginPage && (
              <Form.Group style={{ paddingBottom: '10px' }}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Name"
                  name="fullName"
                  onChange={handleChange}
                  value={formData.fullName}
                  isInvalid={isInvalidCredentials}
                  autoFocus
                />
                {isInvalidCredentials ? (
                  ''
                ) : (
                  <Form.Control.Feedback type="invalid">
                    Please enter your name.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
            <Form.Group style={{ paddingBottom: '10px' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                isInvalid={isInvalidCredentials}
                autoFocus
              />
              {isInvalidCredentials ? (
                ''
              ) : (
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="position-relative mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                isInvalid={isInvalidCredentials}
              />
              {isInvalidCredentials ? (
                <Form.Control.Feedback tooltip type="invalid">
                  {formErrorMessage}
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback type="invalid">
                  Please enter a password.
                </Form.Control.Feedback>
              )}
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
