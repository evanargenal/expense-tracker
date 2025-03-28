import Table from 'react-bootstrap/Table';
import CategoryForm from './CategoryForm';
import { Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface NewCategoryTableFormProps {
  newCategory: Category;
  handleAddCategory: (category: Category) => void;
  toggleNewCategoryMode: () => void;
  selectedCategories: string[];
  handleSelect: (id: string) => void;
}

const NewCategoryTableForm: React.FC<NewCategoryTableFormProps> = ({
  newCategory,
  handleAddCategory,
  toggleNewCategoryMode,
  selectedCategories,
  handleSelect,
}) => {
  return (
    <Table className={styles.expensesTable} responsive striped variant="dark">
      <thead>
        <tr>
          <th>Name</th>
          <th>Icon</th>
          <th>Confirm?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <CategoryForm
            category={newCategory}
            onSave={handleAddCategory}
            onCancel={toggleNewCategoryMode}
            isEditing={false}
            selectedCategories={selectedCategories}
            onSelect={handleSelect}
          />
        </tr>
      </tbody>
    </Table>
  );
};

export default NewCategoryTableForm;
