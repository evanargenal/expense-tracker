import './pages.css';
import styles from './Dashboard.module.css';
import Header from '../components/header/Header';
import ExpensesTable from '../components/tables/ExpensesTable';

function Dashboard() {
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

export default Dashboard;
