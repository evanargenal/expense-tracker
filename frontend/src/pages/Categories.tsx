import './pages.css';
// import styles from './Categories.module.css';
import Header from '../components/header/Header';
// import CategoriesTable from '../components/tables/CategoriesTable';

function Categories() {
  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body" style={{ justifyContent: 'unset' }}>
          {/* <div className={styles.tableExpenses}>
            <CategoriesTable></CategoriesTable>
          </div> */}
          <p className="mt-5">
            🛠️ Categories table is under construction, come back later! 🛠️
          </p>
        </div>
      </div>
    </>
  );
}

export default Categories;
