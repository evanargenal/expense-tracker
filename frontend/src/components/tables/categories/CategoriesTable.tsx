import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import ExpensesTableHeader from '../expenses/ExpensesTableHeader';
import NoExpensesMessage from '../expenses/NoExpensesMessage';
import NewExpenseTableForm from '../expenses/NewExpenseTableForm';
import ExpenseRow from '../expenses/ExpenseRow';
import { useExpenses } from '../../../hooks/expenses/useExpenses';
import { useExpenseActions } from '../../../hooks/expenses/useExpenseActions';

import styles from '../TableStyle.module.css';

function ExpensesTable() {
  const { userExpenses, userCategories, isLoading, fetchUserExpenses } =
    useExpenses();
  const {
    newExpenseMode,
    toggleNewExpenseMode,
    newExpense,
    editExpenseMode,
    toggleEditMode,
    editingExpense,
    setEditingExpense,
    selectedExpenses,
    setSelectedExpenses,
    handleAddExpense,
    handleEditExpense,
    handleDelete,
  } = useExpenseActions(fetchUserExpenses);

  const handleSelect = (id: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === userExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(userExpenses.map((expense) => expense._id));
    }
  };

  const renderNoExpenses = () => {
    return (
      <>
        <NoExpensesMessage
          newExpenseMode={newExpenseMode}
          toggleNewExpenseMode={toggleNewExpenseMode}
        />
        {newExpenseMode && (
          <NewExpenseTableForm
            newExpense={newExpense}
            userCategories={userCategories}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            selectedExpenses={selectedExpenses}
            handleSelect={handleSelect}
          />
        )}
      </>
    );
  };

  const sortedExpenses = userExpenses.sort(
    (a: { date: Date }, b: { date: Date }): number =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const renderSortedExpenseRows = () => {
    return (
      <>
        <ExpensesTableHeader
          newExpenseMode={newExpenseMode}
          toggleNewExpenseMode={toggleNewExpenseMode}
          editExpenseMode={editExpenseMode}
          toggleEditMode={toggleEditMode}
          selectedExpenses={selectedExpenses}
          handleDelete={() => handleDelete(selectedExpenses)}
          fetchUserExpenses={fetchUserExpenses}
        />
        {newExpenseMode && ( // Add new expense form
          <NewExpenseTableForm
            newExpense={newExpense}
            userCategories={userCategories}
            handleAddExpense={handleAddExpense}
            toggleNewExpenseMode={toggleNewExpenseMode}
            selectedExpenses={selectedExpenses}
            handleSelect={handleSelect}
          />
        )}
        <Table
          className={styles.expensesTable}
          striped
          responsive
          variant="dark"
        >
          <thead>
            <tr>
              {editExpenseMode && (
                <th>
                  <Form.Check
                    aria-label="select all"
                    className={styles.customCheck}
                    checked={selectedExpenses.length === userExpenses.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th>Name</th>
              <th>Icon</th>
              <th>Custom?</th>
              {editExpenseMode && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {/* {sortedExpenses?.map((expense) => (
              <ExpenseRow
                key={expense._id}
                expense={expense}
                isEditing={editingExpense._id === expense._id}
                editExpenseMode={editExpenseMode}
                selectedExpenses={selectedExpenses}
                userCategories={userCategories}
                setEditingExpense={setEditingExpense}
                handleDelete={handleDelete}
                handleSelect={handleSelect}
                handleEditExpense={handleEditExpense} // Pass handleAddExpense for ExpenseForm
              />
            ))} */}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        userExpenses.length === 0 ? (
          renderNoExpenses()
        ) : (
          renderSortedExpenseRows()
        )
      ) : (
        <div className="mb-4">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={12} />
            <Placeholder xs={12} />
            <Placeholder xs={12} />
          </Placeholder>
        </div>
      )}
    </>
  );
}

export default ExpensesTable;
