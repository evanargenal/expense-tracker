import Table from 'react-bootstrap/Table';
import CategoryForm from './CategoryForm';
import { Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface NewCategoryTableFormProps {
  newCategory: Category;
  selectedCategories: string[];
  handleAddCategory: (category: Category) => void;
  toggleNewCategoryMode: () => void;
  handleSelect: (id: string) => void;
}

const NewCategoryTableForm: React.FC<NewCategoryTableFormProps> = ({
  newCategory,
  selectedCategories,
  handleAddCategory,
  toggleNewCategoryMode,
  handleSelect,
}) => {
  return (
    <Table
      className={`${styles.tableStyling} ${styles.tableMarginBottom}`}
      responsive
      striped
      variant="dark"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Icon</th>
          <th>Category Type</th>
          <th className="text-center">Confirm?</th>
        </tr>
      </thead>
      <tbody>
        <CategoryForm
          category={newCategory}
          isEditing={false}
          selectedCategories={selectedCategories}
          onSave={handleAddCategory}
          onCancel={toggleNewCategoryMode}
          onSelect={handleSelect}
        />
      </tbody>
    </Table>
  );
};

export default NewCategoryTableForm;
