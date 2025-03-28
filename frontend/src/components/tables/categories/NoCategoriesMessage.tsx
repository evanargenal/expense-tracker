import Button from 'react-bootstrap/Button';
import { PlusLg, DashLg } from 'react-bootstrap-icons';

interface NoCategoriesMessageProps {
  newCategoryMode: boolean;
  toggleNewCategoryMode: () => void;
}

const NoCategoriesMessage: React.FC<NoCategoriesMessageProps> = ({
  newCategoryMode,
  toggleNewCategoryMode,
}) => {
  return (
    <p className="mb-4 mt-5">
      No categories found for your account. <br />
      You should add some to keep your expenses organized! <br /> <br />
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
    </p>
  );
};

export default NoCategoriesMessage;
