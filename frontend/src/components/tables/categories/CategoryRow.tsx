import { Button, Form } from 'react-bootstrap';
import { Trash, Pencil, CheckLg, XLg } from 'react-bootstrap-icons';
import { Category } from '../../../types/types';
import { getEmptyCategoryItem } from '../../../utils/categoryUtils';
import CategoryForm from '../categories/CategoryForm';
import styles from '../TableStyle.module.css';

interface CategoryRowProps {
  category: Category;
  isEditing: boolean;
  editCategoryMode: boolean;
  selectedCategories: string[];
  setEditingCategory: (category: Category) => void;
  handleDelete: (id: string) => void;
  handleSelect: (id: string) => void;
  handleEditCategory: (category: Category) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  isEditing,
  editCategoryMode,
  selectedCategories,
  setEditingCategory,
  handleDelete,
  handleSelect,
  handleEditCategory,
}) => {
  const emptyCategoryForm = getEmptyCategoryItem();
  return (
    <>
      {isEditing ? (
        <CategoryForm
          category={category}
          isEditing
          selectedCategories={selectedCategories}
          onSave={handleEditCategory}
          onCancel={() => setEditingCategory(emptyCategoryForm)}
          onSelect={handleSelect}
        />
      ) : (
        <tr>
          {editCategoryMode && (
            <td style={{ width: '5%' }}>
              <Form.Check
                aria-label="select"
                className={styles['table__custom-check']}
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleSelect(category._id)}
              />
            </td>
          )}
          <td style={{ width: '40%' }}>{category.categoryName}</td>
          <td style={{ width: '10%' }}>{category.icon}</td>
          <td style={{ width: '15%' }}>{category.numMatchedItems}</td>
          {editCategoryMode && (
            <>
              <td style={{ width: '15%' }}>
                {category.userId === '000000000000000000000000' ? (
                  <XLg />
                ) : (
                  <CheckLg />
                )}
              </td>
              <td style={{ width: '10%' }}>
                <div className={styles['table__action-items']}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash />
                  </Button>
                </div>
              </td>
            </>
          )}
        </tr>
      )}
    </>
  );
};

export default CategoryRow;
