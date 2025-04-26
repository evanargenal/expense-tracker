import { useState } from 'react';
import Header from '../../components/header/Header';
import IncomeItemsTable from '../../components/tables/incomeItems/IncomeItemsTable';
import PageControls from '../../components/pagination/PageControls';

import { useIncomeItems } from '../../hooks/incomeItems/useIncomeItems';

import './../../styles/shared.css';
import styles from './IncomeItemsList.module.css';

function IncomeItemsList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const expenses = useIncomeItems(pageNumber, itemsPerPage, sortDirection);

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.tableIncomeItemsContainer}>
            <IncomeItemsTable
              userIncomeItems={expenses.userIncomeItems}
              userCategories={expenses.userCategories}
              isLoading={expenses.isLoading}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              fetchUserIncomeItems={expenses.fetchUserIncomeItems}
            ></IncomeItemsTable>
          </div>
          {expenses.userIncomeItems.length !== 0 && (
            <div className={styles.paginationContainer}>
              <PageControls
                itemTotal={expenses.userIncomeItemTotal}
                pageNumber={pageNumber}
                itemsPerPage={itemsPerPage}
                setPageNumber={setPageNumber}
                setItemsPerPage={setItemsPerPage}
              ></PageControls>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default IncomeItemsList;
