import { Button } from 'react-bootstrap';
import {
  DashLg,
  PlusLg,
  PencilFill,
  ArrowClockwise,
  Trash,
} from 'react-bootstrap-icons';

import { useCategoryActions } from '../../../hooks/categories/useCategoryActions';

import styles from '../TableStyle.module.css';

interface CategoriesTableHeaderProps {
  categoryActions: ReturnType<typeof useCategoryActions>;
  fetchUserCategories: () => Promise<void>;
}

const CategoriesTableHeader: React.FC<CategoriesTableHeaderProps> = ({
  categoryActions,
  fetchUserCategories,
}) => {
  const {
    newCategoryMode,
    editCategoryMode,
    selectedCategories,
    toggleNewCategoryMode,
    toggleEditMode,
    handleDelete,
    handleRestoreDefaultCategories,
  } = categoryActions;
  return (
    <div className={styles.tableHeader}>
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
      <Button
        variant={editCategoryMode ? 'warning' : 'secondary'}
        onClick={toggleEditMode}
      >
        <PencilFill className="mb-1" />
      </Button>
      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" onClick={fetchUserCategories}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {editCategoryMode && (
        <>
          <Button variant="secondary" onClick={handleRestoreDefaultCategories}>
            Restore Default Categories
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedCategories)}
            disabled={selectedCategories.length === 0}
          >
            <Trash />
            {selectedCategories.length > 0 && ` (${selectedCategories.length})`}
          </Button>
        </>
      )}
    </div>
  );
};

export default CategoriesTableHeader;
