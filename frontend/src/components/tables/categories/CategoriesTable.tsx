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
    toggleNewCategoryMode,
    newCategory,
    editCategoryMode,
    toggleEditMode,
    editingCategory,
    setEditingCategory,
    selectedCategories,
    setSelectedCategories,
    handleAddCategory,
    handleEditCategory,
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
        />
        {newCategoryMode && (
          <NewCategoryTableForm
            newCategory={newCategory}
            handleAddCategory={handleAddCategory}
            toggleNewCategoryMode={toggleNewCategoryMode}
            selectedCategories={selectedCategories}
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
          toggleNewCategoryMode={toggleNewCategoryMode}
          editCategoryMode={editCategoryMode}
          toggleEditMode={toggleEditMode}
          selectedCategories={selectedCategories}
          handleDelete={() => handleDelete(selectedCategories)}
          fetchUserCategories={fetchUserCategories}
        />
        {newCategoryMode && ( // Add new category form
          <NewCategoryTableForm
            newCategory={newCategory}
            handleAddCategory={handleAddCategory}
            toggleNewCategoryMode={toggleNewCategoryMode}
            selectedCategories={selectedCategories}
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
                <th>
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
              <th>Name</th>
              <th>Icon</th>
              {editCategoryMode && <th>Action</th>}
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
