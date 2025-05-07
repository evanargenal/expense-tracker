import { useState } from 'react';
import Header from '../../components/header/Header';
import CategoriesTableHeader from '../../components/tables/categories/CategoriesTableHeader';
import CategoriesTable from '../../components/tables/categories/CategoriesTable';
import PageControls from '../../components/pagination/PageControls';

import { useCategoriesWithActions } from '../../hooks/categories/useCategoriesWithActions';
import { CategoryTypeContext } from '../../context/CategoryTypeContext';

import './../../styles/shared.css';
import styles from './CategoriesList.module.css';

// TODO: FIX TABLE HEADER FOR NO EXPENSES AND 'DEPRECATE' NO MESSAGES PAGE/IMPROVE IT
// TODO: REFACTOR THIS PAGE BECAUSE THERE ARE WAY TOO MANY CONSTS

function CategoriesList() {
  const [expensePageNumber, expenseSetPageNumber] = useState(1);
  const [expenseItemsPerPage, expenseSetItemsPerPage] = useState(10);
  const [expenseSortDirection, expenseSetSortDirection] = useState<
    'asc' | 'desc'
  >('asc');

  const {
    userCategories: expenseCategories,
    userCategoryTotal: expenseCategoryTotal,
    isLoading: isExpenseLoading,
    fetchUserCategories: fetchExpenseCategories,
    newCategoryMode: newExpenseCategoryMode,
    newCategory: newExpenseCategory,
    editCategoryMode: editExpenseCategoryMode,
    editingCategory: editingExpenseCategory,
    selectedCategories: selectedExpenseCategories,
    toggleNewCategoryMode: toggleNewExpenseCategoryMode,
    toggleEditMode: toggleExpenseCategoryEditMode,
    setEditingCategory: setEditingExpenseCategory,
    setSelectedCategories: setSelectedExpenseCategories,
    handleAddCategory: handleAddExpenseCategory,
    handleEditCategory: handleEditExpenseCategory,
    handleRestoreDefaultCategories: handleRestoreDefaultExpenseCategories,
    handleDelete: handleDeleteExpenseCategory,
  } = useCategoriesWithActions(
    expensePageNumber,
    expenseItemsPerPage,
    expenseSortDirection,
    'expense'
  );

  const [incomePageNumber, incomeSetPageNumber] = useState(1);
  const [incomeItemsPerPage, incomeSetItemsPerPage] = useState(10);
  const [incomeSortDirection, incomeSetSortDirection] = useState<
    'asc' | 'desc'
  >('asc');

  const {
    userCategories: incomeCategories,
    userCategoryTotal: incomeCategoryTotal,
    isLoading: isIncomeLoading,
    fetchUserCategories: fetchIncomeCategories,
    newCategoryMode: newIncomeCategoryMode,
    newCategory: newIncomeCategory,
    editCategoryMode: editIncomeCategoryMode,
    editingCategory: editingIncomeCategory,
    selectedCategories: selectedIncomeCategories,
    toggleNewCategoryMode: toggleNewIncomeCategoryMode,
    toggleEditMode: toggleIncomeCategoryEditMode,
    setEditingCategory: setEditingIncomeCategory,
    setSelectedCategories: setSelectedIncomeCategories,
    handleAddCategory: handleAddIncomeCategory,
    handleEditCategory: handleEditIncomeCategory,
    handleRestoreDefaultCategories: handleRestoreDefaultIncomeCategories,
    handleDelete: handleDeleteIncomeCategory,
  } = useCategoriesWithActions(
    incomePageNumber,
    incomeItemsPerPage,
    incomeSortDirection,
    'income'
  );

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.expenseCategoriesParentContainer}>
            <CategoryTypeContext.Provider value="expense">
              {!isExpenseLoading && (
                <CategoriesTableHeader
                  itemTotal={expenseCategories.length}
                  fetchUserCategories={fetchExpenseCategories}
                  newCategoryMode={newExpenseCategoryMode}
                  editCategoryMode={editExpenseCategoryMode}
                  selectedCategories={selectedExpenseCategories}
                  toggleNewCategoryMode={toggleNewExpenseCategoryMode}
                  toggleEditMode={toggleExpenseCategoryEditMode}
                  handleDelete={handleDeleteExpenseCategory}
                  handleRestoreDefaultCategories={
                    handleRestoreDefaultExpenseCategories
                  }
                />
              )}
              <div className={styles.tableExpenseCategoriesContainer}>
                <CategoriesTable
                  userCategories={expenseCategories}
                  isLoading={isExpenseLoading}
                  newCategoryMode={newExpenseCategoryMode}
                  newCategory={newExpenseCategory}
                  editCategoryMode={editExpenseCategoryMode}
                  editingCategory={editingExpenseCategory}
                  selectedCategories={selectedExpenseCategories}
                  toggleNewCategoryMode={toggleNewExpenseCategoryMode}
                  setEditingCategory={setEditingExpenseCategory}
                  setSelectedCategories={setSelectedExpenseCategories}
                  handleAddCategory={handleAddExpenseCategory}
                  handleEditCategory={handleEditExpenseCategory}
                  handleDelete={handleDeleteExpenseCategory}
                  sortDirection={expenseSortDirection}
                  setSortDirection={expenseSetSortDirection}
                ></CategoriesTable>
              </div>
              {expenseCategories.length !== 0 && (
                <div className={styles.paginationContainer}>
                  <PageControls
                    itemTotal={expenseCategoryTotal}
                    pageNumber={expensePageNumber}
                    itemsPerPage={expenseItemsPerPage}
                    itemsPerPageArray={[5, 10, 25, 50, 100]}
                    setPageNumber={expenseSetPageNumber}
                    setItemsPerPage={expenseSetItemsPerPage}
                  ></PageControls>
                </div>
              )}
            </CategoryTypeContext.Provider>
          </div>
          <div className={styles.incomeCategoriesParentContainer}>
            <CategoryTypeContext.Provider value="income">
              {!isIncomeLoading && (
                <CategoriesTableHeader
                  itemTotal={incomeCategories.length}
                  fetchUserCategories={fetchIncomeCategories}
                  newCategoryMode={newIncomeCategoryMode}
                  editCategoryMode={editIncomeCategoryMode}
                  selectedCategories={selectedIncomeCategories}
                  toggleNewCategoryMode={toggleNewIncomeCategoryMode}
                  toggleEditMode={toggleIncomeCategoryEditMode}
                  handleDelete={handleDeleteIncomeCategory}
                  handleRestoreDefaultCategories={
                    handleRestoreDefaultIncomeCategories
                  }
                />
              )}
              <div className={styles.tableIncomeCategoriesContainer}>
                <CategoriesTable
                  userCategories={incomeCategories}
                  isLoading={isIncomeLoading}
                  newCategoryMode={newIncomeCategoryMode}
                  newCategory={newIncomeCategory}
                  editCategoryMode={editIncomeCategoryMode}
                  editingCategory={editingIncomeCategory}
                  selectedCategories={selectedIncomeCategories}
                  toggleNewCategoryMode={toggleNewIncomeCategoryMode}
                  setEditingCategory={setEditingIncomeCategory}
                  setSelectedCategories={setSelectedIncomeCategories}
                  handleAddCategory={handleAddIncomeCategory}
                  handleEditCategory={handleEditIncomeCategory}
                  handleDelete={handleDeleteIncomeCategory}
                  sortDirection={incomeSortDirection}
                  setSortDirection={incomeSetSortDirection}
                ></CategoriesTable>
              </div>
              {incomeCategories.length !== 0 && (
                <div className={styles.paginationContainer}>
                  <PageControls
                    itemTotal={incomeCategoryTotal}
                    pageNumber={incomePageNumber}
                    itemsPerPage={incomeItemsPerPage}
                    itemsPerPageArray={[5, 10, 25, 50, 100]}
                    setPageNumber={incomeSetPageNumber}
                    setItemsPerPage={incomeSetItemsPerPage}
                  ></PageControls>
                </div>
              )}
            </CategoryTypeContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoriesList;
