import { useState } from 'react';
import Header from '../../components/header/Header';
import CategoriesTableHeader from '../../components/tables/categories/CategoriesTableHeader';
import CategoriesTable from '../../components/tables/categories/CategoriesTable';
import PageControls from '../../components/pagination/PageControls';

import { useCategories } from '../../hooks/categories/useCategories';
import { useCategoryActions } from '../../hooks/categories/useCategoryActions';

import './../../styles/shared.css';
import styles from './Categories.module.css';

function Categories() {
  const [expensePageNumber, expenseSetPageNumber] = useState(1);
  const [expenseItemsPerPage, expenseSetItemsPerPage] = useState(25);
  const [expenseSortDirection, expenseSetSortDirection] = useState<
    'asc' | 'desc'
  >('asc');
  const expenseCategories = useCategories(
    expensePageNumber,
    expenseItemsPerPage,
    expenseSortDirection,
    'expense'
  );
  const expenseCategoryActions = useCategoryActions(
    expenseCategories.fetchUserCategories
  );

  const [incomePageNumber, incomeSetPageNumber] = useState(1);
  const [incomeItemsPerPage, incomeSetItemsPerPage] = useState(25);
  const [incomeSortDirection, incomeSetSortDirection] = useState<
    'asc' | 'desc'
  >('asc');
  const incomeCategories = useCategories(
    incomePageNumber,
    incomeItemsPerPage,
    incomeSortDirection,
    'income'
  );
  const incomeCategoryActions = useCategoryActions(
    incomeCategories.fetchUserCategories
  );

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.expenseCategoriesParentContainer}>
            {expenseCategories.userCategories.length !== 0 && (
              <CategoriesTableHeader
                categoryActions={expenseCategoryActions}
                fetchUserCategories={expenseCategories.fetchUserCategories}
              />
            )}
            <div className={styles.tableExpenseCategoriesContainer}>
              <CategoriesTable
                userCategories={expenseCategories.userCategories}
                isLoading={expenseCategories.isLoading}
                sortDirection={expenseSortDirection}
                categoryActions={expenseCategoryActions}
                setSortDirection={expenseSetSortDirection}
              ></CategoriesTable>
            </div>
            {expenseCategories.userCategories.length !== 0 && (
              <div className={styles.paginationContainer}>
                <PageControls
                  itemTotal={expenseCategories.userCategoryTotal}
                  pageNumber={expensePageNumber}
                  itemsPerPage={expenseItemsPerPage}
                  setPageNumber={expenseSetPageNumber}
                  setItemsPerPage={expenseSetItemsPerPage}
                ></PageControls>
              </div>
            )}
          </div>
          <div className={styles.incomeCategoriesParentContainer}>
            {incomeCategories.userCategories.length !== 0 && (
              <CategoriesTableHeader
                categoryActions={incomeCategoryActions}
                fetchUserCategories={incomeCategories.fetchUserCategories}
              />
            )}
            <div className={styles.tableIncomeCategoriesContainer}>
              <CategoriesTable
                userCategories={incomeCategories.userCategories}
                isLoading={incomeCategories.isLoading}
                sortDirection={incomeSortDirection}
                categoryActions={incomeCategoryActions}
                setSortDirection={incomeSetSortDirection}
              ></CategoriesTable>
            </div>
            {incomeCategories.userCategories.length !== 0 && (
              <div className={styles.paginationContainer}>
                <PageControls
                  itemTotal={incomeCategories.userCategoryTotal}
                  pageNumber={incomePageNumber}
                  itemsPerPage={incomeItemsPerPage}
                  setPageNumber={incomeSetPageNumber}
                  setItemsPerPage={incomeSetItemsPerPage}
                ></PageControls>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
