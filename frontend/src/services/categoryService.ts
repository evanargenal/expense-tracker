import axios from '../api/axios';

const API_URL = '/categories'; // Base API URL

export const getCategories = async (
  page: number,
  pageSize: number,
  sort: string,
  categoryType: string
) => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, pageSize, sort, categoryType },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const addCategory = async (
  categoryName: string,
  icon: string,
  categoryType: string
) => {
  try {
    const response = await axios.post(API_URL, {
      categoryName,
      icon,
      categoryType,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const editCategory = async (
  id: string,
  updates: Partial<{
    categoryName: string;
    icon: string;
  }>
) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error editing category:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const restoreDefaultCategories = async () => {
  try {
    const response = await axios.post(`${API_URL}/restore`);
    return response.data;
  } catch (error: any) {
    // Expected case: Default categories are already present
    if (error.response?.status === 304) {
      return null;
    }
    console.error('Error restoring default categories:', error);
    throw error; // Re-throw if it's another error
  }
};

export const deleteCategories = async (ids: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/delete`, { ids });
    return response.data;
  } catch (error) {
    console.error('Failed to delete one or more categories:', error);
    throw error; // Re-throw so the component can handle it
  }
};
