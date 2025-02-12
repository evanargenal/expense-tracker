import { useState } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import './style.css';

function LoginModal({ sendDataToParent }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    const { name, value } = event.target; // Get input name and value
    setFormData((prevData) => ({
      ...prevData, // Spread previous state
      [name]: value, // Update the changed field dynamically
    }));
  };

  const handleLogin = (formData) => {
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="loginHeader">
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="emailForm">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={FormData.email}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="passwordForm">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={FormData.password}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={() => handleLogin(formData)}
          >
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
