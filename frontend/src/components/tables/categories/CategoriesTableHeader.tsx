import { Button } from 'react-bootstrap';
import {
  DashLg,
  PlusLg,
  PencilFill,
  ArrowClockwise,
  Trash,
} from 'react-bootstrap-icons';

// import { useCategoryActions } from '../../../hooks/categories/useCategoryActions';
import { useCategoryType } from '../../../context/CategoryTypeContext';

import styles from '../TableStyle.module.css';

interface CategoriesTableHeaderProps {
  itemTotal: number;
  fetchUserCategories: () => Promise<void>;
  newCategoryMode: boolean;
  editCategoryMode: boolean;
  selectedCategories: string[];
  toggleNewCategoryMode: () => void;
  toggleEditMode: () => void;
  handleDelete: (selectedCategories: string | string[]) => Promise<void>;
  handleRestoreDefaultCategories: (categoryType: string) => Promise<void>;
}

const CategoriesTableHeader: React.FC<CategoriesTableHeaderProps> = ({
  itemTotal,
  fetchUserCategories,
  newCategoryMode,
  editCategoryMode,
  selectedCategories,
  toggleNewCategoryMode,
  toggleEditMode,
  handleDelete,
  handleRestoreDefaultCategories,
}) => {
  const categoryType = useCategoryType();
  const categoryTypeLabelMap: Record<string, string> = {
    expense: 'Restore Default Expense Categories',
    income: 'Restore Default Income Categories',
    all: 'Restore All Categories',
  };

  const defaultCategoryButtonLabel =
    categoryTypeLabelMap[categoryType] ?? 'Restore Default Categories';

  return (
    <div className={styles['table__control-buttons']}>
      <Button
        variant={newCategoryMode ? 'secondary' : 'success'}
        onClick={toggleNewCategoryMode}
      >
        {newCategoryMode ? (
          <DashLg className="mb-1" />
        ) : (
          <PlusLg className="mb-1" />
        )}
      </Button>
      {itemTotal !== 0 && (
        <Button
          variant={editCategoryMode ? 'warning' : 'secondary'}
          onClick={toggleEditMode}
        >
          <PencilFill className="mb-1" />
        </Button>
      )}

      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" onClick={fetchUserCategories}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {(editCategoryMode || itemTotal === 0) && (
        <>
          <Button
            variant="secondary"
            onClick={() => handleRestoreDefaultCategories(categoryType)}
          >
            {defaultCategoryButtonLabel}
          </Button>
          {itemTotal !== 0 && (
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedCategories)}
              disabled={selectedCategories.length === 0}
            >
              <Trash />
              {selectedCategories.length > 0 &&
                ` (${selectedCategories.length})`}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesTableHeader;
