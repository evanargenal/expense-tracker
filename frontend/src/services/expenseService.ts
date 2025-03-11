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

export const addExpense = async (
  name: string,
  description: string,
  cost: number,
  date: Date,
  categoryName: string
) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        name,
        description,
        cost,
        date,
        categoryName,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const deleteExpenses = async (ids: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/delete`, { ids });
    return response.data;
  } catch (error) {
    console.error('Failed to delete expense(s):', error);
    throw error; // Re-throw so the component can handle it
  }
};
