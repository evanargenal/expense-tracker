import axios from 'axios';

const API_URL = '/api/expenses'; // Base API URL

export const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete expense:', error);
    throw error; // Re-throw so the component can handle it
  }
};
