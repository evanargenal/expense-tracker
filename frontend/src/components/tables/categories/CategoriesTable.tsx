import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import NewCategoryTableForm from './CategoryTableNewForm';
import CategoryRow from '../categories/CategoryRow';
import { Category } from '../../../types/types';
import { useCategoryType } from '../../../context/CategoryTypeContext';

import styles from '../TableStyle.module.css';

interface CategoriesTableProps {
  userCategories: Category[];
  isLoading: boolean;
  newCategoryMode: boolean;
  newCategory: Category;
  editCategoryMode: boolean;
  editingCategory: Category;
  selectedCategories: string[];
  toggleNewCategoryMode: () => void;
  setEditingCategory: (category: Category) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  handleAddCategory: (category: Category) => Promise<void>;
  handleEditCategory: (category: Category) => Promise<void>;
  handleDelete: (categoryId: string | string[]) => Promise<void>;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

function CategoriesTable({
  userCategories,
  isLoading,
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
  handleDelete,
  sortDirection,
  setSortDirection,
}: CategoriesTableProps) {
  const categoryType = useCategoryType();

  const categoryTypeTableLabelMap: Record<string, string> = {
    expense: 'Expenses',
    income: 'Income',
  };

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
        {newCategoryMode && (
          <NewCategoryTableForm
            newCategory={newCategory}
            selectedCategories={selectedCategories}
            handleAddCategory={handleAddCategory}
            toggleNewCategoryMode={toggleNewCategoryMode}
            handleSelect={handleSelect}
          />
        )}
        {categoryType === 'expense' ? (
          <h3 className={newCategoryMode ? '' : 'mt-2'}>
            No expense categories found for your account. <br />
            You should add some to keep your expenses organized! <br /> <br />
            Or you can restore the default expense categories for inspiration
            😉↑
          </h3>
        ) : (
          <h3 className={newCategoryMode ? '' : 'mt-2'}>
            No income categories found for your account. <br />
            You should add some to keep your income items organized! <br />{' '}
            <br />
            Or you can restore the default income categories for inspiration 😉↑
          </h3>
        )}
      </>
    );
  };

  const renderCategoryRows = () => {
    return (
      <>
        {newCategoryMode && ( // Add new category form
          <div className={styles['table--margin-bottom']}>
            <NewCategoryTableForm
              newCategory={newCategory}
              selectedCategories={selectedCategories}
              handleAddCategory={handleAddCategory}
              toggleNewCategoryMode={toggleNewCategoryMode}
              handleSelect={handleSelect}
            />
          </div>
        )}
        <div className={styles['table__scroll-container']}>
          <Table
            className={styles['table__layout']}
            striped
            responsive
            data-bs-theme="dark"
          >
            <thead>
              <tr>
                {editCategoryMode && (
                  <th className={styles['table__custom-check-container']}>
                    <Form.Check
                      aria-label="select all"
                      className={styles['table__custom-check']}
                      checked={
                        selectedCategories.length === userCategories.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th style={{ cursor: 'pointer' }} onClick={toggleSortOrder}>
                  <div className={styles['table__items-with-icons']}>
                    <span>Name</span>
                    {sortDirection === 'asc' ? (
                      <CaretDownFill />
                    ) : (
                      <CaretUpFill />
                    )}
                  </div>
                </th>
                <th style={{ width: '60px' }} className="text-center">
                  Icon
                </th>
                <th style={{ width: '115px' }} className="text-center">
                  {categoryTypeTableLabelMap[categoryType]}
                </th>
                {editCategoryMode && (
                  <>
                    <th style={{ width: '100px' }} className="text-center">
                      Custom
                    </th>
                    <th className={styles['table__action-items-container']}>
                      Action
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className={styles['table__body-scroll']}>
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
                  handleEditCategory={handleEditCategory}
                />
              ))}
            </tbody>
          </Table>
        </div>
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
