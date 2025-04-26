import axios from '../api/axios';

const API_URL = '/income'; // Base API URL

export const getIncomeItems = async (
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
    console.error('Error fetching income items:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const addIncomeItem = async (
  name: string,
  description: string,
  amount: number,
  date: Date,
  categoryId: string
) => {
  try {
    const response = await axios.post(API_URL, {
      name,
      description,
      amount,
      date,
      categoryId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding income item:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const editMultipleIncomeItemCategories = async (
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
    console.error('Error editing income item categories:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const editIncomeItem = async (
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    amount: number | undefined;
    date: Date | undefined;
    categoryId: string;
  }>
) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error editing income item:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const deleteIncomeItems = async (ids: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/delete`, { ids });
    return response.data;
  } catch (error) {
    console.error('Failed to delete income item(s):', error);
    throw error; // Re-throw so the component can handle it
  }
};
