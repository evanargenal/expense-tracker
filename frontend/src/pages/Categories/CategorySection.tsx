import { useState, useEffect } from 'react';
import CategoriesTableHeader from '../../components/tables/categories/CategoriesTableHeader';
import CategoriesTable from '../../components/tables/categories/CategoriesTable';
import PageControls from '../../components/pagination/PageControls';

import { useCategoriesWithActions } from '../../hooks/categories/useCategoriesWithActions';
import { CategoryTypeContext } from '../../context/CategoryTypeContext';

import './../../styles/shared.css';
import styles from './CategorySection.module.css';

interface CategorySectionProps {
  categoryType: 'income' | 'expense';
}

function CategorySection({ categoryType }: CategorySectionProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const {
    userCategories,
    userCategoryTotal,
    isLoading,
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
  } = useCategoriesWithActions(
    pageNumber,
    itemsPerPage,
    sortDirection,
    categoryType
  );

  useEffect(() => {
    setSelectedCategories([]);
  }, [pageNumber, itemsPerPage, sortDirection, setSelectedCategories]);

  return (
    <>
      <div className={styles['category-section__container']}>
        <CategoryTypeContext.Provider value={categoryType}>
          {!isLoading && (
            <CategoriesTableHeader
              itemTotal={userCategories.length}
              newCategoryMode={newCategoryMode}
              editCategoryMode={editCategoryMode}
              selectedCategories={selectedCategories}
              toggleNewCategoryMode={toggleNewCategoryMode}
              toggleEditMode={toggleEditMode}
              handleDelete={handleDelete}
              handleRestoreDefaultCategories={handleRestoreDefaultCategories}
            />
          )}
          <div className={styles['category-section__table']}>
            <CategoriesTable
              userCategories={userCategories}
              isLoading={isLoading}
              newCategoryMode={newCategoryMode}
              newCategory={newCategory}
              editCategoryMode={editCategoryMode}
              editingCategory={editingCategory}
              selectedCategories={selectedCategories}
              toggleNewCategoryMode={toggleNewCategoryMode}
              setEditingCategory={setEditingCategory}
              setSelectedCategories={setSelectedCategories}
              handleAddCategory={handleAddCategory}
              handleEditCategory={handleEditCategory}
              handleDelete={handleDelete}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            ></CategoriesTable>
          </div>
          {userCategories.length !== 0 && (
            <PageControls
              itemTotal={userCategoryTotal}
              pageNumber={pageNumber}
              itemsPerPage={itemsPerPage}
              itemsPerPageArray={[5, 10, 25, 50, 100]}
              setPageNumber={setPageNumber}
              setItemsPerPage={setItemsPerPage}
            ></PageControls>
          )}
        </CategoryTypeContext.Provider>
      </div>
    </>
  );
}

export default CategorySection;
