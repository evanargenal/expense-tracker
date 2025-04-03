import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import {
  DashLg,
  PlusLg,
  PencilFill,
  ArrowClockwise,
  ListCheck,
  CaretDownFill,
  CaretUpFill,
} from 'react-bootstrap-icons';

import { Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface ExpensesTableHeaderProps {
  newExpenseMode: boolean;
  editExpenseMode: boolean;
  selectedExpenses: string[];
  userCategories: Category[];
  toggleNewExpenseMode: () => void;
  toggleEditMode: () => void;
  handleDelete: () => void;
  handleUpdateMultipleExpenseCategories: (
    ids: string[],
    newCategoryId: string
  ) => void;
  fetchUserExpenses: () => void;
}

const ExpensesTableHeader: React.FC<ExpensesTableHeaderProps> = ({
  newExpenseMode,
  editExpenseMode,
  selectedExpenses,
  userCategories,
  toggleNewExpenseMode,
  toggleEditMode,
  handleDelete,
  handleUpdateMultipleExpenseCategories,
  fetchUserExpenses,
}) => {
  const [showCategories, setShowCategories] = useState(false);

  const toggleShowCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div className={styles.tableHeader}>
      <Button
        variant={newExpenseMode ? 'secondary' : 'success'}
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
        onClick={toggleEditMode}
      >
        <PencilFill className="mb-1" />
      </Button>
      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" onClick={fetchUserExpenses}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {editExpenseMode && (
        <Dropdown
          data-bs-theme="dark"
          align="end"
          onToggle={(isOpen) => {
            if (!isOpen) setShowCategories(false); // Reset showing categories when dropdown closes
          }}
        >
          <Dropdown.Toggle
            id="selectedDropdown"
            variant="secondary"
            disabled={selectedExpenses.length === 0}
          >
            <ListCheck />
            {selectedExpenses.length > 0 && ` (${selectedExpenses.length})`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleDelete}>
              Delete {selectedExpenses.length}{' '}
              {selectedExpenses.length === 1 ? 'Expense' : 'Expenses'}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation(); // Prevents the parent dropdown from closing
                toggleShowCategories();
              }}
            >
              Update {selectedExpenses.length}{' '}
              {selectedExpenses.length === 1 ? 'Category' : 'Categories'}{' '}
              {showCategories ? <CaretUpFill /> : <CaretDownFill />}
            </Dropdown.Item>
            {showCategories &&
              userCategories?.map((category) => (
                <Dropdown.Item
                  key={category._id}
                  onClick={() => {
                    handleUpdateMultipleExpenseCategories(
                      selectedExpenses,
                      category._id
                    );
                  }}
                >
                  {category.icon} {category.categoryName}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default ExpensesTableHeader;
