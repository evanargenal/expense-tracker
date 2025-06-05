import Table from 'react-bootstrap/Table';
import IncomeItemForm from './IncomeItemForm';
import { IncomeItem, Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface IncomeItemTableNewFormProps {
  newIncomeItem: IncomeItem;
  userIncomeCategories: Category[];
  selectedIncomeItems: string[];
  handleAddIncomeItem: (incomeItem: IncomeItem) => void;
  toggleNewIncomeItemMode: () => void;
  handleSelect: (id: string) => void;
}

const IncomeItemTableNewForm: React.FC<IncomeItemTableNewFormProps> = ({
  newIncomeItem,
  userIncomeCategories,
  selectedIncomeItems,
  handleAddIncomeItem,
  toggleNewIncomeItemMode,
  handleSelect,
}) => {
  return (
    <div>
      <Table
        className={styles['table__layout']}
        responsive
        striped
        data-bs-theme="dark"
      >
        <thead>
          <IncomeItemForm
            incomeItem={newIncomeItem}
            userIncomeCategories={userIncomeCategories}
            isEditing={false}
            selectedIncomeItems={selectedIncomeItems}
            onSave={handleAddIncomeItem}
            onCancel={toggleNewIncomeItemMode}
            onSelect={handleSelect}
          />
        </thead>
      </Table>
    </div>
  );
};

export default IncomeItemTableNewForm;
