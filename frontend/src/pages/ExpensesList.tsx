import './pages.css';
import styles from './ExpensesList.module.css';
import Header from '../components/header/Header';
import ExpensesTable from '../components/tables/expenses/ExpensesTable';

function ExpensesList() {
  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body" style={{ justifyContent: 'unset' }}>
          <div className={styles.tableExpenses}>
            <ExpensesTable></ExpensesTable>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpensesList;
