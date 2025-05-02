import { useState } from 'react';
import {
  addExpense,
  editExpense,
  editMultipleExpenseCategories,
  deleteExpenses,
} from '../../services/expenseService';
import { ExpenseItem } from '../../types/types';
import { getEmptyExpenseItem } from '../../utils/expenseUtils';

export function useExpenseActions(fetchUserExpenses: () => Promise<void>) {
  const emptyExpenseForm = getEmptyExpenseItem();
  const [newExpenseMode, setNewExpenseMode] = useState(false);
  const [newExpense, setNewExpense] = useState<ExpenseItem>(emptyExpenseForm);
  const [editExpenseMode, setEditExpenseMode] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<ExpenseItem>(emptyExpenseForm);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  const toggleNewExpenseMode = () => {
    setNewExpenseMode(!newExpenseMode);
    setNewExpense(emptyExpenseForm);
  };

  const toggleEditMode = () => {
    setEditExpenseMode(!editExpenseMode);
    setEditingExpense(emptyExpenseForm);
    setSelectedExpenses([]);
  };

  const handleAddExpense = async (expense: ExpenseItem) => {
    try {
      await addExpense(
        expense.name,
        expense.description,
        Number(expense.cost),
        expense.date,
        expense.categoryId
      );
      toggleNewExpenseMode();
      fetchUserExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (expense: ExpenseItem) => {
    try {
      await editExpense(expense._id, {
        ...expense,
        cost: Number(expense.cost),
        date: new Date(expense.date),
      });
      setEditingExpense(emptyExpenseForm);
      fetchUserExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleUpdateMultipleExpenseCategories = async (
    ids: string | string[],
    newCategoryId: string
  ) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (
      !window.confirm(
        `Are you sure you want to update ${idsArray.length} expense(s) categories?`
      )
    )
      return;

    try {
      await editMultipleExpenseCategories(idsArray, newCategoryId);
      setSelectedExpenses((prev) =>
        prev.filter((id) => !idsArray.includes(id))
      );
      fetchUserExpenses();
    } catch (error) {
      console.error('Failed to update expense(s) categories:', error);
    }
  };

  const handleDelete = async (ids: string | string[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (
      !window.confirm(
        `Are you sure you want to delete ${idsArray.length} expense(s)?`
      )
    )
      return;

    try {
      await deleteExpenses(idsArray);
      setSelectedExpenses((prev) =>
        prev.filter((id) => !idsArray.includes(id))
      );
      fetchUserExpenses();
    } catch (error) {
      console.error('Failed to delete expense(s):', error);
    }
  };

  return {
    newExpenseMode,
    newExpense,
    editExpenseMode,
    editingExpense,
    selectedExpenses,
    toggleNewExpenseMode,
    setNewExpense,
    toggleEditMode,
    setEditingExpense,
    setSelectedExpenses,
    handleAddExpense,
    handleEditExpense,
    handleUpdateMultipleExpenseCategories,
    handleDelete,
  };
}
