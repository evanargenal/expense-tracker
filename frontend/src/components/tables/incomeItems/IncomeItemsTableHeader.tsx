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

interface IncomeItemsTableHeaderProps {
  itemTotal: number;
  userIncomeCategories: Category[];
  fetchUserIncomeItems: () => Promise<void>;
  newIncomeItemMode: boolean;
  editIncomeItemMode: boolean;
  selectedIncomeItems: string[];
  toggleNewIncomeItemMode: () => void;
  toggleEditMode: () => void;
  handleDelete: (selectedIncomeItems: string | string[]) => Promise<void>;
  handleUpdateMultipleIncomeItemCategories: (
    selectedIncomeItems: string | string[],
    newCategoryId: string
  ) => Promise<void>;
}

const IncomeItemsTableHeader: React.FC<IncomeItemsTableHeaderProps> = ({
  itemTotal,
  userIncomeCategories,
  fetchUserIncomeItems,
  newIncomeItemMode,
  editIncomeItemMode,
  selectedIncomeItems,
  toggleNewIncomeItemMode,
  toggleEditMode,
  handleDelete,
  handleUpdateMultipleIncomeItemCategories,
}) => {
  const [showCategories, setShowCategories] = useState(false);

  const toggleShowCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div className={styles['table__header']}>
      <Button
        variant={newIncomeItemMode ? 'secondary' : 'success'}
        onClick={toggleNewIncomeItemMode}
      >
        {newIncomeItemMode ? (
          <DashLg className="mb-1" />
        ) : (
          <PlusLg className="mb-1" />
        )}
      </Button>
      {itemTotal !== 0 && (
        <Button
          variant={editIncomeItemMode ? 'warning' : 'secondary'}
          onClick={toggleEditMode}
        >
          <PencilFill className="mb-1" />
        </Button>
      )}
      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" onClick={fetchUserIncomeItems}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {editIncomeItemMode && (
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
            disabled={selectedIncomeItems.length === 0}
          >
            <ListCheck />
            {selectedIncomeItems.length > 0 &&
              ` (${selectedIncomeItems.length})`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleDelete(selectedIncomeItems)}>
              Delete {selectedIncomeItems.length}{' '}
              {selectedIncomeItems.length === 1
                ? 'Income Item'
                : 'Income Items'}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation(); // Prevents the parent dropdown from closing
                toggleShowCategories();
              }}
            >
              Update {selectedIncomeItems.length}{' '}
              {selectedIncomeItems.length === 1 ? 'Category' : 'Categories'}{' '}
              {showCategories ? <CaretUpFill /> : <CaretDownFill />}
            </Dropdown.Item>
            {showCategories && (
              <>
                <Dropdown.Item
                  key={''}
                  onClick={() => {
                    handleUpdateMultipleIncomeItemCategories(
                      selectedIncomeItems,
                      ''
                    );
                  }}
                >
                  No Category
                </Dropdown.Item>

                {userIncomeCategories?.map((category) => (
                  <Dropdown.Item
                    key={category._id}
                    onClick={() => {
                      handleUpdateMultipleIncomeItemCategories(
                        selectedIncomeItems,
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

export default IncomeItemsTableHeader;
