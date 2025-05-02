import { useState } from 'react';
import Header from '../../components/header/Header';
import IncomeItemsTableHeader from '../../components/tables/incomeItems/IncomeItemsTableHeader';
import IncomeItemsTable from '../../components/tables/incomeItems/IncomeItemsTable';
import PageControls from '../../components/pagination/PageControls';

import { useIncomeItems } from '../../hooks/incomeItems/useIncomeItems';
import { useIncomeItemActions } from '../../hooks/incomeItems/useIncomeItemActions';

import './../../styles/shared.css';
import styles from './IncomeItemsList.module.css';

function IncomeItemsList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const incomeItems = useIncomeItems(pageNumber, itemsPerPage, sortDirection);
  const incomeItemActions = useIncomeItemActions(
    incomeItems.fetchUserIncomeItems
  );

  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.incomeParentContainer}>
            {incomeItems.userIncomeItems.length !== 0 && (
              <IncomeItemsTableHeader
                userIncomeCategories={incomeItems.userIncomeCategories}
                incomeItemActions={incomeItemActions}
                fetchUserIncomeItems={incomeItems.fetchUserIncomeItems}
              />
            )}
            <div className={styles.tableIncomeItemsContainer}>
              <IncomeItemsTable
                userIncomeItems={incomeItems.userIncomeItems}
                userIncomeCategories={incomeItems.userIncomeCategories}
                isLoading={incomeItems.isLoading}
                sortDirection={sortDirection}
                incomeItemActions={incomeItemActions}
                setSortDirection={setSortDirection}
              ></IncomeItemsTable>
            </div>
            {incomeItems.userIncomeItems.length !== 0 && (
              <div className={styles.paginationContainer}>
                <PageControls
                  itemTotal={incomeItems.userIncomeItemTotal}
                  pageNumber={pageNumber}
                  itemsPerPage={itemsPerPage}
                  setPageNumber={setPageNumber}
                  setItemsPerPage={setItemsPerPage}
                ></PageControls>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default IncomeItemsList;
