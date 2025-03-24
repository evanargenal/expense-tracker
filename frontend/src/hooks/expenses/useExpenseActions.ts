import { useState } from 'react';
import {
  addExpense,
  editExpense,
  deleteExpenses,
} from '../../services/expenseService';
import { ExpenseItem } from '../../types/types';
import { getEmptyExpenseItem } from '../../utils/expenseUtils';

export function useExpenseActions(fetchUserExpenses: () => void) {
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
        expense.categoryName
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
    toggleNewExpenseMode,
    newExpense,
    setNewExpense,
    editExpenseMode,
    toggleEditMode,
    editingExpense,
    setEditingExpense,
    selectedExpenses,
    setSelectedExpenses,
    handleAddExpense,
    handleEditExpense,
    handleDelete,
  };
}
