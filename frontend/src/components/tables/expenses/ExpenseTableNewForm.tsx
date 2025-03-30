import Table from 'react-bootstrap/Table';
import ExpenseForm from './ExpenseForm';
import { ExpenseItem, Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface ExpenseTableNewFormProps {
  newExpense: ExpenseItem;
  userCategories: Category[];
  handleAddExpense: (expense: ExpenseItem) => void;
  toggleNewExpenseMode: () => void;
  selectedExpenses: string[];
  handleSelect: (id: string) => void;
}

const ExpenseTableNewForm: React.FC<ExpenseTableNewFormProps> = ({
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
        <ExpenseForm
          expense={newExpense}
          userCategories={userCategories}
          onSave={handleAddExpense}
          onCancel={toggleNewExpenseMode}
          isEditing={false}
          selectedExpenses={selectedExpenses}
          onSelect={handleSelect}
        />
      </tbody>
    </Table>
  );
};

export default ExpenseTableNewForm;
