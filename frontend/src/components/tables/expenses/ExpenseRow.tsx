import { Button, Form } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
import { ExpenseItem, Category } from '../../../types/types';
import { getEmptyExpenseItem } from '../../../utils/expenseUtils';
import ExpenseForm from './ExpenseForm';
import styles from '../TableStyle.module.css';

interface ExpenseRowProps {
  expense: ExpenseItem;
  isEditing: boolean;
  editExpenseMode: boolean;
  selectedExpenses: string[];
  userCategories: Category[];
  setEditingExpense: (expense: ExpenseItem) => void;
  handleDelete: (id: string) => void;
  handleSelect: (id: string) => void;
  handleEditExpense: (expense: ExpenseItem) => void;
}

const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  isEditing,
  editExpenseMode,
  selectedExpenses,
  userCategories,
  setEditingExpense,
  handleDelete,
  handleSelect,
  handleEditExpense,
}) => {
  const emptyExpenseForm = getEmptyExpenseItem();
  return (
    <>
      {isEditing ? (
        <ExpenseForm
          expense={expense}
          userCategories={userCategories}
          isEditing
          selectedExpenses={selectedExpenses}
          onSave={handleEditExpense}
          onCancel={() => setEditingExpense(emptyExpenseForm)}
          onSelect={handleSelect}
        />
      ) : (
        <tr>
          {editExpenseMode && (
            <td>
              <Form.Check
                aria-label="select"
                className={styles.customCheck}
                checked={selectedExpenses.includes(expense._id)}
                onChange={() => handleSelect(expense._id)}
              />
            </td>
          )}
          <td>
            {new Date(expense.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </td>
          <td>{expense.name}</td>
          <td>{expense.description}</td>
          <td>
            {expense.categoryName} {expense.icon}
          </td>
          <td className="text-end">${Number(expense.cost).toFixed(2)}</td>
          {editExpenseMode && (
            <td>
              <div className={styles.actionItems}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingExpense(expense)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(expense._id)}
                >
                  <Trash />
                </Button>
              </div>
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default ExpenseRow;
