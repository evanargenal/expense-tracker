import Button from 'react-bootstrap/Button';
import { PlusLg, DashLg } from 'react-bootstrap-icons';

interface NoExpensesMessageProps {
  newExpenseMode: boolean;
  toggleNewExpenseMode: () => void;
}

const NoExpensesMessage: React.FC<NoExpensesMessageProps> = ({
  newExpenseMode,
  toggleNewExpenseMode,
}) => {
  return (
    <p className="mb-4 mt-5">
      No expenses found for your account. <br />
      Either you're a liar or you need to add some! <br /> <br />
      <Button
        variant={newExpenseMode ? 'secondary' : 'success'}
        size="lg"
        onClick={toggleNewExpenseMode}
      >
        Add Expense{' '}
        {newExpenseMode ? (
          <DashLg className="mb-1" />
        ) : (
          <PlusLg className="mb-1" />
        )}
      </Button>
    </p>
  );
};

export default NoExpensesMessage;
