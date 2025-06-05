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
  itemTotal: number;
  userExpenseCategories: Category[];
  fetchUserExpenses: () => Promise<void>;
  newExpenseMode: boolean;
  editExpenseMode: boolean;
  selectedExpenses: string[];
  toggleNewExpenseMode: () => void;
  toggleEditMode: () => void;
  handleDelete: (selectedExpenses: string | string[]) => Promise<void>;
  handleUpdateMultipleExpenseCategories: (
    selectedExpenses: string | string[],
    newCategoryId: string
  ) => Promise<void>;
}

const ExpensesTableHeader: React.FC<ExpensesTableHeaderProps> = ({
  itemTotal,
  userExpenseCategories,
  fetchUserExpenses,
  newExpenseMode,
  editExpenseMode,
  selectedExpenses,
  toggleNewExpenseMode,
  toggleEditMode,
  handleDelete,
  handleUpdateMultipleExpenseCategories,
}) => {
  const [showCategories, setShowCategories] = useState(false);

  const toggleShowCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div className={styles['table__control-buttons']} data-bs-theme="dark">
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
      {itemTotal !== 0 && (
        <Button
          variant={editExpenseMode ? 'warning' : 'secondary'}
          onClick={toggleEditMode}
        >
          <PencilFill className="mb-1" />
        </Button>
      )}
      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" onClick={fetchUserExpenses}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {editExpenseMode && (
        <Dropdown
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
            <Dropdown.Item onClick={() => handleDelete(selectedExpenses)}>
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
            {showCategories && (
              <>
                <Dropdown.Item
                  key={''}
                  onClick={() => {
                    handleUpdateMultipleExpenseCategories(selectedExpenses, '');
                  }}
                >
                  No Category
                </Dropdown.Item>

                {userExpenseCategories?.map((category) => (
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
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default ExpensesTableHeader;
