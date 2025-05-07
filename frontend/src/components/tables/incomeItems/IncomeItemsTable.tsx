import Table from 'react-bootstrap/Table';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import IncomeItemTableNewForm from './IncomeItemTableNewForm';
import IncomeItemRow from './IncomeItemRow';
import { IncomeItem, Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface IncomeItemsTableProps {
  userIncomeItems: IncomeItem[];
  userIncomeCategories: Category[];
  isLoading: boolean;
  newIncomeItemMode: boolean;
  newIncomeItem: IncomeItem;
  editIncomeItemMode: boolean;
  editingIncomeItem: IncomeItem;
  selectedIncomeItems: string[];
  toggleNewIncomeItemMode: () => void;
  setEditingIncomeItem: (incomeItem: IncomeItem) => void;
  setSelectedIncomeItems: React.Dispatch<React.SetStateAction<string[]>>;
  handleAddIncomeItem: (incomeItem: IncomeItem) => Promise<void>;
  handleEditIncomeItem: (incomeItem: IncomeItem) => Promise<void>;
  handleDelete: (incomeItemId: string | string[]) => Promise<void>;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

function IncomeItemsTable({
  userIncomeItems,
  userIncomeCategories,
  isLoading,
  newIncomeItemMode,
  newIncomeItem,
  editIncomeItemMode,
  editingIncomeItem,
  selectedIncomeItems,
  toggleNewIncomeItemMode,
  setEditingIncomeItem,
  setSelectedIncomeItems,
  handleAddIncomeItem,
  handleEditIncomeItem,
  handleDelete,
  sortDirection,
  setSortDirection,
}: IncomeItemsTableProps) {
  const toggleSortOrder = () =>
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));

  const handleSelect = (id: string) => {
    setSelectedIncomeItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIncomeItems.length === userIncomeItems.length) {
      setSelectedIncomeItems([]);
    } else {
      setSelectedIncomeItems(
        userIncomeItems.map((incomeItem) => incomeItem._id)
      );
    }
  };

  const renderNoIncomeItems = () => {
    return (
      <>
        {newIncomeItemMode && (
          <IncomeItemTableNewForm
            newIncomeItem={newIncomeItem}
            userIncomeCategories={userIncomeCategories}
            selectedIncomeItems={selectedIncomeItems}
            handleAddIncomeItem={handleAddIncomeItem}
            toggleNewIncomeItemMode={toggleNewIncomeItemMode}
            handleSelect={handleSelect}
          />
        )}
        <h3 className={newIncomeItemMode ? '' : 'mt-2'}>
          No income items found for your account. <br />
          Either you're broke or you need to add some! <br /> <br />
        </h3>
      </>
    );
  };

  const renderSortedIncomeItemRows = () => {
    return (
      <>
        {newIncomeItemMode && ( // Add new income item form
          <IncomeItemTableNewForm
            newIncomeItem={newIncomeItem}
            userIncomeCategories={userIncomeCategories}
            selectedIncomeItems={selectedIncomeItems}
            handleAddIncomeItem={handleAddIncomeItem}
            toggleNewIncomeItemMode={toggleNewIncomeItemMode}
            handleSelect={handleSelect}
          />
        )}
        <Table
          className={styles.tableStyling}
          striped
          responsive
          variant="dark"
        >
          <thead>
            <tr>
              {editIncomeItemMode && (
                <th style={{ width: '5%' }}>
                  <Form.Check
                    aria-label="select all"
                    className={styles.customCheck}
                    checked={
                      selectedIncomeItems.length === userIncomeItems.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th
                style={{ width: '20%', cursor: 'pointer' }}
                onClick={toggleSortOrder}
              >
                <div className={styles.itemsWithIcons}>
                  <span>Date</span>
                  {sortDirection === 'desc' ? (
                    <CaretDownFill />
                  ) : (
                    <CaretUpFill />
                  )}
                </div>
              </th>
              <th style={{ width: '15%' }}>Name</th>
              <th style={{ width: '15%' }}>Description</th>
              <th style={{ width: '20%' }}>Category</th>
              <th style={{ width: '10%' }}>Amount</th>
              {editIncomeItemMode && (
                <th className="text-center" style={{ width: '10%' }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {userIncomeItems?.map((incomeItem) => (
              <IncomeItemRow
                key={incomeItem._id}
                incomeItem={incomeItem}
                isEditing={editingIncomeItem._id === incomeItem._id}
                editIncomeItemMode={editIncomeItemMode}
                selectedIncomeItems={selectedIncomeItems}
                userIncomeCategories={userIncomeCategories}
                setEditingIncomeItem={setEditingIncomeItem}
                handleDelete={handleDelete}
                handleSelect={handleSelect}
                handleEditIncomeItem={handleEditIncomeItem} // Pass handleAddIncomeItem for IncomeItemForm
              />
            ))}
            <tr>
              <th colSpan={editIncomeItemMode ? 5 : 4}>Total</th>
              <th colSpan={editIncomeItemMode ? 2 : 1}>
                $
                {userIncomeItems
                  .reduce((total, item) => total + Number(item.amount), 0)
                  .toFixed(2)}
              </th>
            </tr>
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        userIncomeItems.length === 0 ? (
          renderNoIncomeItems()
        ) : (
          renderSortedIncomeItemRows()
        )
      ) : (
        <div className="mb-4">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
            <Placeholder xs={12} bg="dark" />
          </Placeholder>
        </div>
      )}
    </>
  );
}

export default IncomeItemsTable;
