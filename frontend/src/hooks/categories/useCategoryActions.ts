import { useState } from 'react';
import {
  addCategory,
  editCategory,
  restoreDefaultCategories,
  deleteCategories,
} from '../../services/categoryService';
import { Category } from '../../types/types';
import { getEmptyCategoryItem } from '../../utils/categoryUtils';

export function useCategoryActions(
  fetchUserCategories: () => Promise<void>,
  getCurrentCategoriesCount: () => number
) {
  const emptyCategoryForm = getEmptyCategoryItem();
  const [newCategoryMode, setNewCategoryMode] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>(emptyCategoryForm);
  const [editCategoryMode, setEditCategoryMode] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category>(emptyCategoryForm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleNewCategoryMode = () => {
    setNewCategoryMode(!newCategoryMode);
    setNewCategory(emptyCategoryForm);
  };

  const toggleEditMode = () => {
    setEditCategoryMode(!editCategoryMode);
    setEditingCategory(emptyCategoryForm);
    setSelectedCategories([]);
  };

  const handleAddCategory = async (category: Category) => {
    try {
      await addCategory(
        category.categoryName,
        category.icon,
        category.categoryType
      );
      toggleNewCategoryMode();
      await fetchUserCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async (category: Category) => {
    try {
      await editCategory(category._id, {
        ...category,
      });
      setEditingCategory(emptyCategoryForm);
      await fetchUserCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleRestoreDefaultCategories = async (categoryType: string) => {
    if (
      !window.confirm(
        `Are you sure you want to restore the default ${categoryType} categories?`
      )
    )
      return;
    try {
      const data = await restoreDefaultCategories(categoryType);
      if (data !== null) {
        await fetchUserCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (ids: string | string[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (
      !window.confirm(
        `Are you sure you want to delete ${idsArray.length} categor${
          idsArray.length === 1 ? 'y' : 'ies'
        }?`
      )
    )
      return;

    const wasLastItem = getCurrentCategoriesCount() === idsArray.length;

    try {
      await deleteCategories(idsArray);
      setSelectedCategories((prev) =>
        prev.filter((id) => !idsArray.includes(id))
      );
      await fetchUserCategories();
      if (wasLastItem) {
        toggleEditMode();
      }
    } catch (error) {
      console.error('Failed to delete category(ies):', error);
    }
  };

  return {
    newCategoryMode,
    newCategory,
    editCategoryMode,
    editingCategory,
    selectedCategories,
    toggleNewCategoryMode,
    toggleEditMode,
    setEditingCategory,
    setSelectedCategories,
    handleAddCategory,
    handleEditCategory,
    handleRestoreDefaultCategories,
    handleDelete,
  };
}
