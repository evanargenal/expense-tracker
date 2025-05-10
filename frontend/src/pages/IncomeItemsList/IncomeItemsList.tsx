import { useState } from 'react';
import Header from '../../components/header/Header';
import IncomeItemsTableHeader from '../../components/tables/incomeItems/IncomeItemsTableHeader';
import IncomeItemsTable from '../../components/tables/incomeItems/IncomeItemsTable';
import PageControls from '../../components/pagination/PageControls';

import { useIncomeItemsWithActions } from '../../hooks/incomeItems/useIncomeItemsWithActions';

import './../../styles/shared.css';
import styles from './IncomeItemsList.module.css';

function IncomeItemsList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const {
    userIncomeItems,
    userIncomeItemTotal,
    userIncomeCategories,
    isLoading,
    fetchUserIncomeItems,
    newIncomeItemMode,
    newIncomeItem,
    editIncomeItemMode,
    editingIncomeItem,
    selectedIncomeItems,
    toggleNewIncomeItemMode,
    toggleEditMode,
    setEditingIncomeItem,
    setSelectedIncomeItems,
    handleAddIncomeItem,
    handleEditIncomeItem,
    handleUpdateMultipleIncomeItemCategories,
    handleDelete,
  } = useIncomeItemsWithActions(pageNumber, itemsPerPage, sortDirection);

  return (
    <>
      <div className="app">
        <div className="app-header">
          <Header />
        </div>
        <div className="app-body">
          <div className={styles['income-list__container']}>
            {!isLoading && (
              <IncomeItemsTableHeader
                itemTotal={userIncomeItems.length}
                userIncomeCategories={userIncomeCategories}
                fetchUserIncomeItems={fetchUserIncomeItems}
                newIncomeItemMode={newIncomeItemMode}
                editIncomeItemMode={editIncomeItemMode}
                selectedIncomeItems={selectedIncomeItems}
                toggleNewIncomeItemMode={toggleNewIncomeItemMode}
                toggleEditMode={toggleEditMode}
                handleDelete={handleDelete}
                handleUpdateMultipleIncomeItemCategories={
                  handleUpdateMultipleIncomeItemCategories
                }
              />
            )}
            <div className={styles['income-list__table']}>
              <IncomeItemsTable
                userIncomeItems={userIncomeItems}
                userIncomeCategories={userIncomeCategories}
                isLoading={isLoading}
                newIncomeItemMode={newIncomeItemMode}
                newIncomeItem={newIncomeItem}
                editIncomeItemMode={editIncomeItemMode}
                editingIncomeItem={editingIncomeItem}
                selectedIncomeItems={selectedIncomeItems}
                toggleNewIncomeItemMode={toggleNewIncomeItemMode}
                setEditingIncomeItem={setEditingIncomeItem}
                setSelectedIncomeItems={setSelectedIncomeItems}
                handleAddIncomeItem={handleAddIncomeItem}
                handleEditIncomeItem={handleEditIncomeItem}
                handleDelete={handleDelete}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              ></IncomeItemsTable>
            </div>
            {userIncomeItems.length !== 0 && (
              <div className={styles['income-list__pagination']}>
                <PageControls
                  itemTotal={userIncomeItemTotal}
                  pageNumber={pageNumber}
                  itemsPerPage={itemsPerPage}
                  itemsPerPageArray={[25, 50, 100]}
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
