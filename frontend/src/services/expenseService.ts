import axios from '../api/axios';

const API_URL = '/expenses'; // Base API URL

export const getExpenses = async (
  page: number,
  pageSize: number,
  sort: string
) => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, pageSize, sort },
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
  categoryId: string
) => {
  try {
    const response = await axios.post(API_URL, {
      name,
      description,
      cost,
      date,
      categoryId,
    });
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
    const response = await axios.patch(`${API_URL}/update-categories`, {
      ids,
      newCategoryId,
    });
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
    categoryId: string;
  }>
) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error editing expense:', error);
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
