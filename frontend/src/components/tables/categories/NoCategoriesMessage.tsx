import Button from 'react-bootstrap/Button';
import { PlusLg, DashLg } from 'react-bootstrap-icons';

import styles from '../TableStyle.module.css';

interface NoCategoriesMessageProps {
  newCategoryMode: boolean;
  toggleNewCategoryMode: () => void;
  handleRestoreDefaultCategories: () => void;
}

const NoCategoriesMessage: React.FC<NoCategoriesMessageProps> = ({
  newCategoryMode,
  toggleNewCategoryMode,
  handleRestoreDefaultCategories,
}) => {
  return (
    <>
      <p className="mt-5">
        No categories found for your account. <br />
        You should add some to keep your expenses organized! <br /> <br />
        Or you can restore the default categories for inspiration 😉↓
      </p>
      <div className={styles.centeredButtons}>
        <Button
          variant={newCategoryMode ? 'secondary' : 'success'}
          size="lg"
          onClick={toggleNewCategoryMode}
        >
          Add Category{' '}
          {newCategoryMode ? (
            <DashLg className="mb-1" />
          ) : (
            <PlusLg className="mb-1" />
          )}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleRestoreDefaultCategories}
        >
          Restore Default Categories
        </Button>
      </div>
    </>
  );
};

export default NoCategoriesMessage;
