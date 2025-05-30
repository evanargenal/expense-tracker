import { Button, Form } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
import { IncomeItem, Category } from '../../../types/types';
import { getEmptyIncomeItem } from '../../../utils/incomeItemUtils';
import IncomeItemForm from './IncomeItemForm';
import styles from '../TableStyle.module.css';

interface IncomeItemRowProps {
  incomeItem: IncomeItem;
  isEditing: boolean;
  editIncomeItemMode: boolean;
  selectedIncomeItems: string[];
  userIncomeCategories: Category[];
  setEditingIncomeItem: (incomeItem: IncomeItem) => void;
  handleDelete: (id: string) => void;
  handleSelect: (id: string) => void;
  handleEditIncomeItem: (incomeItem: IncomeItem) => void;
}

const IncomeItemRow: React.FC<IncomeItemRowProps> = ({
  incomeItem,
  isEditing,
  editIncomeItemMode,
  selectedIncomeItems,
  userIncomeCategories,
  setEditingIncomeItem,
  handleDelete,
  handleSelect,
  handleEditIncomeItem,
}) => {
  const emptyIncomeItemForm = getEmptyIncomeItem();
  return (
    <>
      {isEditing ? (
        <IncomeItemForm
          incomeItem={incomeItem}
          userIncomeCategories={userIncomeCategories}
          isEditing
          selectedIncomeItems={selectedIncomeItems}
          onSave={handleEditIncomeItem}
          onCancel={() => setEditingIncomeItem(emptyIncomeItemForm)}
          onSelect={handleSelect}
        />
      ) : (
        <tr>
          {editIncomeItemMode && (
            <td style={{ width: '5%' }}>
              <Form.Check
                aria-label="select"
                className={styles['table__custom-check']}
                checked={selectedIncomeItems.includes(incomeItem._id)}
                onChange={() => handleSelect(incomeItem._id)}
              />
            </td>
          )}
          <td style={{ width: '20%' }}>
            {new Date(incomeItem.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </td>
          <td style={{ width: '15%' }}>{incomeItem.name}</td>
          <td style={{ width: '15%' }}>{incomeItem.description}</td>
          <td style={{ width: '20%' }}>
            {incomeItem.categoryName} {incomeItem.icon}
          </td>
          <td style={{ width: '10%' }}>
            ${Number(incomeItem.amount).toFixed(2)}
          </td>
          {editIncomeItemMode && (
            <td style={{ width: '10%' }}>
              <div className={styles['table__action-items']}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingIncomeItem(incomeItem)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(incomeItem._id)}
                >
                  <Trash />
                </Button>
              </div>
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default IncomeItemRow;
