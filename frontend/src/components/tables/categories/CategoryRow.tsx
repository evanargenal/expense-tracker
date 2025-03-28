import { Button, Form } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
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
    <tr>
      {isEditing ? (
        <CategoryForm
          category={category}
          onSave={handleEditCategory}
          onCancel={() => setEditingCategory(emptyCategoryForm)}
          isEditing
          selectedCategories={selectedCategories}
          onSelect={handleSelect}
        />
      ) : (
        <>
          {editCategoryMode && (
            <td>
              <Form.Check
                aria-label="select"
                className={styles.customCheck}
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleSelect(category._id)}
              />
            </td>
          )}
          <td>{category.categoryName}</td>
          <td>{category.icon}</td>
          {editCategoryMode && (
            <td>
              <div className={styles.actionItems}>
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
          )}
        </>
      )}
    </tr>
  );
};

export default CategoryRow;
