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
    <div>
      <Table
        className={styles['table__layout']}
        responsive
        striped
        variant="dark"
      >
        <thead>
          <CategoryForm
            category={newCategory}
            isEditing={false}
            selectedCategories={selectedCategories}
            onSave={handleAddCategory}
            onCancel={toggleNewCategoryMode}
            onSelect={handleSelect}
          />
        </thead>
      </Table>
    </div>
  );
};

export default NewCategoryTableForm;
