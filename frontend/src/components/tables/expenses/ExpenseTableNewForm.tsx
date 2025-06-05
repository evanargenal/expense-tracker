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
    <div>
      <Table
        className={styles['table__layout']}
        responsive
        striped
        data-bs-theme="dark"
      >
        <thead>
          <ExpenseForm
            expense={newExpense}
            userExpenseCategories={userExpenseCategories}
            isEditing={false}
            selectedExpenses={selectedExpenses}
            onSave={handleAddExpense}
            onCancel={toggleNewExpenseMode}
            onSelect={handleSelect}
          />
        </thead>
      </Table>
    </div>
  );
};

export default ExpenseTableNewForm;
