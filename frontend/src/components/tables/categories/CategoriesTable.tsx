import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import NoCategoriesMessage from '../categories/NoCategoriesMessage';
import NewCategoryTableForm from './CategoryTableNewForm';
import CategoryRow from '../categories/CategoryRow';
import { useCategoryActions } from '../../../hooks/categories/useCategoryActions';
import { Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface CategoriesTableProps {
  userCategories: Category[];
  isLoading: boolean;
  sortDirection: string;
  categoryActions: ReturnType<typeof useCategoryActions>;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

function CategoriesTable({
  userCategories,
  isLoading,
  sortDirection,
  categoryActions,
  setSortDirection,
}: CategoriesTableProps) {
  const {
    newCategoryMode,
    newCategory,
    editCategoryMode,
    editingCategory,
    selectedCategories,
    toggleNewCategoryMode,
    setEditingCategory,
    setSelectedCategories,
    handleAddCategory,
    handleEditCategory,
    handleRestoreDefaultCategories,
    handleDelete,
  } = categoryActions;

  const toggleSortOrder = () =>
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));

  const handleSelect = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === userCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(userCategories.map((category) => category._id));
    }
  };

  const renderNoCategories = () => {
    return (
      <>
        <NoCategoriesMessage
          newCategoryMode={newCategoryMode}
          toggleNewCategoryMode={toggleNewCategoryMode}
          handleRestoreDefaultCategories={handleRestoreDefaultCategories}
        />
        {newCategoryMode && (
          <NewCategoryTableForm
            newCategory={newCategory}
            selectedCategories={selectedCategories}
            handleAddCategory={handleAddCategory}
            toggleNewCategoryMode={toggleNewCategoryMode}
            handleSelect={handleSelect}
          />
        )}
      </>
    );
  };

  const renderCategoryRows = () => {
    return (
      <>
        {newCategoryMode && ( // Add new category form
          <NewCategoryTableForm
            newCategory={newCategory}
            selectedCategories={selectedCategories}
            handleAddCategory={handleAddCategory}
            toggleNewCategoryMode={toggleNewCategoryMode}
            handleSelect={handleSelect}
          />
        )}
        <Table
          className={styles.tableStyling}
          striped
          responsive
          variant="dark"
        >
          <thead>
            <tr>
              {editCategoryMode && (
                <th style={{ width: '5%' }}>
                  <Form.Check
                    aria-label="select all"
                    className={styles.customCheck}
                    checked={
                      selectedCategories.length === userCategories.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th
                style={{ width: '45%', cursor: 'pointer' }}
                onClick={toggleSortOrder}
              >
                <div className={styles.itemsWithIcons}>
                  <span>Name</span>
                  {sortDirection === 'asc' ? (
                    <CaretDownFill />
                  ) : (
                    <CaretUpFill />
                  )}
                </div>
              </th>
              <th style={{ width: '10%' }}>Icon</th>
              <th style={{ width: '15%' }}>Expenses</th>
              {editCategoryMode && (
                <>
                  <th style={{ width: '10%' }}>Custom?</th>
                  <th className="text-center" style={{ width: '10%' }}>
                    Action
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {userCategories?.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                isEditing={editingCategory._id === category._id}
                editCategoryMode={editCategoryMode}
                selectedCategories={selectedCategories}
                setEditingCategory={setEditingCategory}
                handleDelete={handleDelete}
                handleSelect={handleSelect}
                handleEditCategory={handleEditCategory} // Pass handleAddCategory for CategoryForm
              />
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        userCategories.length === 0 ? (
          renderNoCategories()
        ) : (
          renderCategoryRows()
        )
      ) : (
        <div className="mb-4">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
          </Placeholder>
        </div>
      )}
    </>
  );
}

export default CategoriesTable;
