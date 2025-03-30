import axios from 'axios';

const API_URL = '/api/auth'; // Base API URL

export const validateUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/validate`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    // Expected case: User is not logged in (no token)
    if (error.response?.status === 401) {
      return null;
    } else {
      console.error('Error with token check', error);
      throw error; // Re-throw so the component can handle it
    }
  }
};

export const loginUser = (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = (
  fullName: string,
  email: string,
  password: string
) => {
  return axios.post(`${API_URL}/register`, {
    fullName,
    email,
    password,
    isAdmin: false,
  });
};

export const logoutUser = () => {
  return axios.get(`${API_URL}/logout`);
};
