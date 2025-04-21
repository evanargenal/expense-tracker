import { useState } from 'react';
import Header from '../../components/header/Header';
import CategoriesTable from '../../components/tables/categories/CategoriesTable';
import PageControls from '../../components/pagination/PageControls';

import { useCategories } from '../../hooks/categories/useCategories';

import './../../styles/shared.css';
import styles from './Categories.module.css';

function Categories() {
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const categories = useCategories(pageNumber, itemsPerPage, sortDirection);
  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <div className={styles.tableExpenses}>
            <CategoriesTable
              userCategories={categories.userCategories}
              isLoading={categories.isLoading}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              fetchUserCategories={categories.fetchUserCategories}
            ></CategoriesTable>
          </div>
          {categories.userCategories.length !== 0 && (
            <div className={styles.paginationContainer}>
              <PageControls
                itemTotal={categories.userCategoryTotal}
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

export default Categories;
