import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

import styles from './PageControls.module.css';

function PageControls({
  itemTotal,
  pageNumber,
  itemsPerPage,
  itemsPerPageArray,
  setPageNumber,
  setItemsPerPage,
}: {
  itemTotal: number;
  pageNumber: number;
  itemsPerPage: number;
  itemsPerPageArray: number[];
  setPageNumber: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}) {
  const totalPages = Math.ceil(itemTotal / itemsPerPage);
  const start = (pageNumber - 1) * itemsPerPage + 1;
  const end = Math.min(pageNumber * itemsPerPage, itemTotal);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) setPageNumber(page);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setPageNumber(1);
  };

  return (
    <div className={styles['page-controls__container']} data-bs-theme="dark">
      <div className={styles['page-controls__summary-row']}>
        <span>
          <span className={styles['page-controls__pagination-showing-text']}>
            Showing
          </span>{' '}
          <b>
            {start} - {end}
          </b>{' '}
          of <b>{itemTotal}</b>
        </span>
        <Form.Select
          name="itemsPerPage"
          value={itemsPerPage}
          onChange={handleDropdownChange}
          aria-label="Items per page"
        >
          {itemsPerPageArray.map((itemPerPageOption) => (
            <option key={itemPerPageOption} value={itemPerPageOption}>
              {itemPerPageOption} Per Page
            </option>
          ))}
        </Form.Select>
      </div>
      <div>
        <Pagination size="sm" className={styles['page-controls__per-selector']}>
          {totalPages !== 1 && (
            <span style={{ display: 'flex' }}>
              <Pagination.First
                disabled={pageNumber === 1}
                onClick={() => handlePageClick(1)}
              />
              <Pagination.Prev
                disabled={pageNumber === 1}
                onClick={() => handlePageClick(pageNumber - 1)}
              />
            </span>
          )}
          <span>
            <span className={styles['page-controls__pagination-page-text']}>
              Page
            </span>{' '}
            <b>{pageNumber}</b> of <b>{totalPages}</b>
          </span>
          {totalPages !== 1 && (
            <span style={{ display: 'flex' }}>
              <Pagination.Next
                disabled={pageNumber === totalPages}
                onClick={() => handlePageClick(pageNumber + 1)}
              />
              <Pagination.Last
                disabled={pageNumber === totalPages}
                onClick={() => handlePageClick(totalPages)}
              />
            </span>
          )}
        </Pagination>
      </div>
    </div>
  );
}

export default PageControls;
