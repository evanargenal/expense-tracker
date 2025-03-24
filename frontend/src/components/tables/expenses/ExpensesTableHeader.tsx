import { Button } from 'react-bootstrap';
import {
  DashLg,
  PlusLg,
  PencilFill,
  ArrowClockwise,
} from 'react-bootstrap-icons';

import styles from '../TableStyle.module.css';

interface ExpensesTableHeaderProps {
  newExpenseMode: boolean;
  toggleNewExpenseMode: () => void;
  editExpenseMode: boolean;
  toggleEditMode: () => void;
  selectedExpenses: string[];
  handleDelete: () => void;
  fetchUserExpenses: () => void;
}

const ExpensesTableHeader: React.FC<ExpensesTableHeaderProps> = ({
  newExpenseMode,
  toggleNewExpenseMode,
  editExpenseMode,
  toggleEditMode,
  selectedExpenses,
  handleDelete,
  fetchUserExpenses,
}) => {
  return (
    <div className={styles.tableHeader}>
      <Button
        variant={newExpenseMode ? 'secondary' : 'success'}
        size="lg"
        onClick={toggleNewExpenseMode}
      >
        {newExpenseMode ? (
          <DashLg className="mb-1" />
        ) : (
          <PlusLg className="mb-1" />
        )}
      </Button>
      <Button
        variant={editExpenseMode ? 'warning' : 'secondary'}
        size="lg"
        onClick={toggleEditMode}
      >
        <PencilFill className="mb-1" />
      </Button>
      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" size="lg" onClick={fetchUserExpenses}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {selectedExpenses.length > 0 && (
        <Button variant="danger" size="lg" onClick={handleDelete}>
          Delete Selected ({selectedExpenses.length})
        </Button>
      )}
    </div>
  );
};

export default ExpensesTableHeader;
