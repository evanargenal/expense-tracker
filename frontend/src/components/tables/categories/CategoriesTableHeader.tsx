import { Button } from 'react-bootstrap';
import {
  DashLg,
  PlusLg,
  PencilFill,
  ArrowClockwise,
  Trash,
} from 'react-bootstrap-icons';

import styles from '../TableStyle.module.css';

interface CategoriesTableHeaderProps {
  newCategoryMode: boolean;
  editCategoryMode: boolean;
  selectedCategories: string[];
  toggleNewCategoryMode: () => void;
  toggleEditMode: () => void;
  handleDelete: () => void;
  handleRestoreDefaultCategories: () => void;
  fetchUserCategories: () => void;
}

const CategoriesTableHeader: React.FC<CategoriesTableHeaderProps> = ({
  newCategoryMode,
  editCategoryMode,
  selectedCategories,
  toggleNewCategoryMode,
  toggleEditMode,
  handleDelete,
  handleRestoreDefaultCategories,
  fetchUserCategories,
}) => {
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
            onClick={handleDelete}
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
