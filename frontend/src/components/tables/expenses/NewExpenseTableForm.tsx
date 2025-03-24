import Table from 'react-bootstrap/Table';
import ExpenseForm from './ExpenseForm';
import { ExpenseItem, Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface NewExpenseTableFormProps {
  newExpense: ExpenseItem;
  userCategories: Category[];
  handleAddExpense: (expense: ExpenseItem) => void;
  toggleNewExpenseMode: () => void;
  selectedExpenses: string[];
  handleSelect: (id: string) => void;
}

const NewExpenseTableForm: React.FC<NewExpenseTableFormProps> = ({
  newExpense,
  userCategories,
  handleAddExpense,
  toggleNewExpenseMode,
  selectedExpenses,
  handleSelect,
}) => {
  return (
    <Table className={styles.expensesTable} responsive striped variant="dark">
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Cost</th>
          <th>Confirm?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <ExpenseForm
            expense={newExpense}
            userCategories={userCategories}
            onSave={handleAddExpense}
            onCancel={toggleNewExpenseMode}
            isEditing={false}
            selectedExpenses={selectedExpenses}
            onSelect={handleSelect}
          />
        </tr>
      </tbody>
    </Table>
  );
};

export default NewExpenseTableForm;
