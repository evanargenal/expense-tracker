import Button from 'react-bootstrap/Button';
import { PlusLg, DashLg } from 'react-bootstrap-icons';

interface NoIncomeItemsMessageProps {
  newIncomeItemMode: boolean;
  toggleNewIncomeItemMode: () => void;
}

const NoIncomeItemsMessage: React.FC<NoIncomeItemsMessageProps> = ({
  newIncomeItemMode,
  toggleNewIncomeItemMode,
}) => {
  return (
    <h3 className="mb-4 mt-5">
      No income items found for your account. <br />
      Either you're broke or you need to add some! <br /> <br />
      <Button
        variant={newIncomeItemMode ? 'secondary' : 'success'}
        size="lg"
        onClick={toggleNewIncomeItemMode}
      >
        Add Income Item{' '}
        {newIncomeItemMode ? (
          <DashLg className="mb-1" />
        ) : (
          <PlusLg className="mb-1" />
        )}
      </Button>
    </h3>
  );
};

export default NoIncomeItemsMessage;
