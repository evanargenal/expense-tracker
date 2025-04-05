import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser, registerUser } from '../../services/authService';
import { FormData } from '../../types/types';

export function useAuthForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [validated, setValidated] = useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [isLoginPage, setIsLoginPage] = useState(true);

  const emptyFormData: FormData = { fullName: '', email: '', password: '' };
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsInvalidCredentials(false);
  };

  const toggleLoginPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    clearForm();
    setIsLoginPage((prev) => !prev);
  };

  const clearForm = () => {
    setValidated(false);
    setIsInvalidCredentials(false);
    setFormErrorMessage('');
    setFormData(emptyFormData);
  };

  const handleLoginOrRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
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

      setUser(response.data);
      navigate('/expenses-list');
    } catch (error: any) {
      setFormErrorMessage(
        error.response?.data?.message === 'User does not exist'
          ? 'No email found. Please check your email or sign up.'
          : error.response?.data?.message === 'Invalid credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.response?.data?.message === 'User already exists'
          ? 'An account with this email already exists. Try logging in.'
          : 'An unexpected error occurred. Please try again later.'
      );
      setValidated(false);
      setIsInvalidCredentials(true);
    }
  };

  return {
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
  };
}
