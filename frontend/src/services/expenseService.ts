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

export const editMultipleExpenseCategories = async (
  ids: string[],
  newCategoryId: string
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/update-categories`,
      { ids, newCategoryId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing expense categories:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const editExpense = async (
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    cost: number | undefined;
    date: Date | undefined;
    categoryName: string;
  }>
) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error editing expense:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const deleteExpenses = async (ids: string[]) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete`,
      { ids },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete expense(s):', error);
    throw error; // Re-throw so the component can handle it
  }
};
