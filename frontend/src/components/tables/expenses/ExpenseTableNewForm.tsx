import Table from 'react-bootstrap/Table';
import ExpenseForm from './ExpenseForm';
import { ExpenseItem, Category } from '../../../types/types';
import styles from '../TableStyle.module.css';

interface ExpenseTableNewFormProps {
  newExpense: ExpenseItem;
  userExpenseCategories: Category[];
  selectedExpenses: string[];
  handleAddExpense: (expense: ExpenseItem) => void;
  toggleNewExpenseMode: () => void;
  handleSelect: (id: string) => void;
}

const ExpenseTableNewForm: React.FC<ExpenseTableNewFormProps> = ({
  newExpense,
  userExpenseCategories,
  selectedExpenses,
  handleAddExpense,
  toggleNewExpenseMode,
  handleSelect,
}) => {
  return (
    <Table
      className={`${styles['table__layout']} ${styles['table--margin-bottom']}`}
      responsive
      striped
      variant="dark"
    >
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Cost</th>
          <th className="text-center">Confirm?</th>
        </tr>
      </thead>
      <tbody>
        <ExpenseForm
          expense={newExpense}
          userExpenseCategories={userExpenseCategories}
          isEditing={false}
          selectedExpenses={selectedExpenses}
          onSave={handleAddExpense}
          onCancel={toggleNewExpenseMode}
          onSelect={handleSelect}
        />
      </tbody>
    </Table>
  );
};

export default ExpenseTableNewForm;
