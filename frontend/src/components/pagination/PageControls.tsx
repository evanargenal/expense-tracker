import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

import styles from './PageControlsStyle.module.css';

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

  const renderPaginationItems = () => {
    const items = [];

    if (pageNumber > 2) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageClick(1)}>
          1
        </Pagination.Item>
      );
      if (pageNumber > 3) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
      if (i > 0 && i <= totalPages) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === pageNumber}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (pageNumber < totalPages - 1) {
      if (pageNumber < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.flexRowContainer}>
        <span>
          Showing{' '}
          <b>
            {start} - {end}
          </b>{' '}
          of <b>{itemTotal}</b>
        </span>
        <div className={styles.noGapFlexRowContainer}>
          <Form.Select
            name="itemsPerPage"
            value={itemsPerPage}
            onChange={handleDropdownChange}
          >
            {itemsPerPageArray.map((itemPerPageOption) => (
              <option value={itemPerPageOption}>{itemPerPageOption}</option>
            ))}
          </Form.Select>
          <p>Per Page</p>
        </div>
      </div>
      <Pagination data-bs-theme="dark" style={{ marginBottom: 'unset' }}>
        <Pagination.First
          disabled={pageNumber === 1}
          onClick={() => handlePageClick(1)}
        />
        <Pagination.Prev
          disabled={pageNumber === 1}
          onClick={() => handlePageClick(pageNumber - 1)}
        />
        {renderPaginationItems()}
        <Pagination.Next
          disabled={pageNumber === totalPages}
          onClick={() => handlePageClick(pageNumber + 1)}
        />
        <Pagination.Last
          disabled={pageNumber === totalPages}
          onClick={() => handlePageClick(totalPages)}
        />
      </Pagination>
    </div>
  );
}

export default PageControls;
