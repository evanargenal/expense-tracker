import { useAuthForm } from '../../hooks/auth/useAuthForm';

import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import styles from './LoginModal.module.css';

interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, handleClose }) => {
  const {
    formData,
    validated,
    isInvalidCredentials,
    formErrorMessage,
    isLoginPage,
    handleChange,
    toggleLoginPage,
    handleLoginOrRegister,
    clearForm,
    setIsLoginPage,
  } = useAuthForm();

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          clearForm();
          setIsLoginPage(true);
        }}
      >
        <Modal.Header className={styles['login-modal__header']}>
          <Modal.Title>{isLoginPage ? 'Log In' : 'Sign Up'}</Modal.Title>
          <CloseButton
            className={styles['login-modal__close-button']}
            onClick={() => {
              handleClose();
              clearForm();
              setIsLoginPage(true);
            }}
          ></CloseButton>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleLoginOrRegister}
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
          <div className={styles['login-modal__footer-text']}>
            <span>
              {isLoginPage
                ? "New around here? I think it's time you"
                : 'Been here before? Maybe you should'}
            </span>
            <span>
              <a href="/#" role="button" onClick={toggleLoginPage}>
                {isLoginPage ? 'sign up!' : ' log in!'}
              </a>
            </span>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginModal;
