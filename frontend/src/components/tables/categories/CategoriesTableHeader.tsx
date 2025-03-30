import { Button } from 'react-bootstrap';
import {
  DashLg,
  PlusLg,
  PencilFill,
  ArrowClockwise,
} from 'react-bootstrap-icons';

import styles from '../TableStyle.module.css';

interface CategoriesTableHeaderProps {
  newCategoryMode: boolean;
  toggleNewCategoryMode: () => void;
  editCategoryMode: boolean;
  toggleEditMode: () => void;
  selectedCategories: string[];
  handleDelete: () => void;
  handleRestoreDefaultCategories: () => void;
  fetchUserCategories: () => void;
}

const CategoriesTableHeader: React.FC<CategoriesTableHeaderProps> = ({
  newCategoryMode,
  toggleNewCategoryMode,
  editCategoryMode,
  toggleEditMode,
  selectedCategories,
  handleDelete,
  handleRestoreDefaultCategories,
  fetchUserCategories,
}) => {
  return (
    <div className={styles.tableHeader}>
      <Button
        variant={newCategoryMode ? 'secondary' : 'success'}
        size="lg"
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
        size="lg"
        onClick={toggleEditMode}
      >
        <PencilFill className="mb-1" />
      </Button>
      {/* ENABLE THIS BUTTON FOR DEBUGGING ONLY */}
      <Button variant="outline-primary" size="lg" onClick={fetchUserCategories}>
        <ArrowClockwise className="mb-1" />
      </Button>
      {editCategoryMode && (
        <Button
          variant="secondary"
          size="lg"
          onClick={handleRestoreDefaultCategories}
        >
          Restore Default Categories
        </Button>
      )}
      {selectedCategories.length > 0 && (
        <Button variant="danger" size="lg" onClick={handleDelete}>
          Delete Selected ({selectedCategories.length})
        </Button>
      )}
    </div>
  );
};

export default CategoriesTableHeader;
