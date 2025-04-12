import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import CategoriesTableHeader from '../categories/CategoriesTableHeader';
import NoCategoriesMessage from '../categories/NoCategoriesMessage';
import NewCategoryTableForm from './CategoryTableNewForm';
import CategoryRow from '../categories/CategoryRow';
import { useCategories } from '../../../hooks/categories/useCategories';
import { useCategoryActions } from '../../../hooks/categories/useCategoryActions';

import styles from '../TableStyle.module.css';

function CategoriesTable() {
  const { userCategories, isLoading, fetchUserCategories } = useCategories();
  const {
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
  } = useCategoryActions(fetchUserCategories);

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
        <CategoriesTableHeader
          newCategoryMode={newCategoryMode}
          editCategoryMode={editCategoryMode}
          selectedCategories={selectedCategories}
          handleDelete={() => handleDelete(selectedCategories)}
          toggleNewCategoryMode={toggleNewCategoryMode}
          toggleEditMode={toggleEditMode}
          handleRestoreDefaultCategories={handleRestoreDefaultCategories}
          fetchUserCategories={fetchUserCategories}
        />
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
          className={styles.expensesTable}
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
              <th style={{ width: '45%' }}>Name</th>
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
            <Placeholder xs={12} />
            <Placeholder xs={12} />
            <Placeholder xs={12} />
          </Placeholder>
        </div>
      )}
    </>
  );
}

export default CategoriesTable;
