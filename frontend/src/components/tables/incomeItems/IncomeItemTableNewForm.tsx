import Table from 'react-bootstrap/Table';
import IncomeItemForm from './IncomeItemForm';
import { IncomeItem, Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface IncomeItemTableNewFormProps {
  newIncomeItem: IncomeItem;
  userCategories: Category[];
  selectedIncomeItems: string[];
  handleAddIncomeItem: (incomeItem: IncomeItem) => void;
  toggleNewIncomeItemMode: () => void;
  handleSelect: (id: string) => void;
}

const IncomeItemTableNewForm: React.FC<IncomeItemTableNewFormProps> = ({
  newIncomeItem,
  userCategories,
  selectedIncomeItems,
  handleAddIncomeItem,
  toggleNewIncomeItemMode,
  handleSelect,
}) => {
  return (
    <Table className={styles.tableStyling} responsive striped variant="dark">
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th className="text-center">Confirm?</th>
        </tr>
      </thead>
      <tbody>
        <IncomeItemForm
          incomeItem={newIncomeItem}
          userCategories={userCategories}
          isEditing={false}
          selectedIncomeItems={selectedIncomeItems}
          onSave={handleAddIncomeItem}
          onCancel={toggleNewIncomeItemMode}
          onSelect={handleSelect}
        />
      </tbody>
    </Table>
  );
};

export default IncomeItemTableNewForm;
