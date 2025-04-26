import { useState } from 'react';
import {
  addIncomeItem,
  editIncomeItem,
  editMultipleIncomeItemCategories,
  deleteIncomeItems,
} from '../../services/incomeService';
import { IncomeItem } from '../../types/types';
import { getEmptyIncomeItem } from '../../utils/incomeItemUtils';

export function useIncomeItemActions(fetchUserIncomeItems: () => void) {
  const emptyIncomeItemForm = getEmptyIncomeItem();
  const [newIncomeItemMode, setNewIncomeItemMode] = useState(false);
  const [newIncomeItem, setNewIncomeItem] =
    useState<IncomeItem>(emptyIncomeItemForm);
  const [editIncomeItemMode, setEditIncomeItemMode] = useState(false);
  const [editingIncomeItem, setEditingIncomeItem] =
    useState<IncomeItem>(emptyIncomeItemForm);
  const [selectedIncomeItems, setSelectedIncomeItems] = useState<string[]>([]);

  const toggleNewIncomeItemMode = () => {
    setNewIncomeItemMode(!newIncomeItemMode);
    setNewIncomeItem(emptyIncomeItemForm);
  };

  const toggleEditMode = () => {
    setEditIncomeItemMode(!editIncomeItemMode);
    setEditingIncomeItem(emptyIncomeItemForm);
    setSelectedIncomeItems([]);
  };

  const handleAddIncomeItem = async (incomeItem: IncomeItem) => {
    try {
      await addIncomeItem(
        incomeItem.name,
        incomeItem.description,
        Number(incomeItem.amount),
        incomeItem.date,
        incomeItem.categoryId
      );
      toggleNewIncomeItemMode();
      fetchUserIncomeItems();
    } catch (error) {
      console.error('Error adding income item:', error);
    }
  };

  const handleEditIncomeItem = async (incomeItem: IncomeItem) => {
    try {
      await editIncomeItem(incomeItem._id, {
        ...incomeItem,
        amount: Number(incomeItem.amount),
        date: new Date(incomeItem.date),
      });
      setEditingIncomeItem(emptyIncomeItemForm);
      fetchUserIncomeItems();
    } catch (error) {
      console.error('Error updating income item:', error);
    }
  };

  const handleUpdateMultipleIncomeItemCategories = async (
    ids: string | string[],
    newCategoryId: string
  ) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (
      !window.confirm(
        `Are you sure you want to update ${idsArray.length} income item(s) categories?`
      )
    )
      return;

    try {
      await editMultipleIncomeItemCategories(idsArray, newCategoryId);
      setSelectedIncomeItems((prev) =>
        prev.filter((id) => !idsArray.includes(id))
      );
      fetchUserIncomeItems();
    } catch (error) {
      console.error('Failed to update income item(s) categories:', error);
    }
  };

  const handleDelete = async (ids: string | string[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (
      !window.confirm(
        `Are you sure you want to delete ${idsArray.length} income item(s)?`
      )
    )
      return;

    try {
      await deleteIncomeItems(idsArray);
      setSelectedIncomeItems((prev) =>
        prev.filter((id) => !idsArray.includes(id))
      );
      fetchUserIncomeItems();
    } catch (error) {
      console.error('Failed to delete income item(s):', error);
    }
  };

  return {
    newIncomeItemMode,
    newIncomeItem,
    editIncomeItemMode,
    editingIncomeItem,
    selectedIncomeItems,
    toggleNewIncomeItemMode,
    setNewIncomeItem,
    toggleEditMode,
    setEditingIncomeItem,
    setSelectedIncomeItems,
    handleAddIncomeItem,
    handleEditIncomeItem,
    handleUpdateMultipleIncomeItemCategories,
    handleDelete,
  };
}
