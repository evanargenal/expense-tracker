import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CheckLg, XLg } from 'react-bootstrap-icons';

import { ExpenseItem, Category } from '../../types/types';

import styles from './TableStyle.module.css';

interface ExpenseFormProps {
  expense: ExpenseItem;
  userCategories: Category[];
  onSave: (expense: ExpenseItem) => void;
  onCancel: () => void;
  isEditing: boolean;
  selectedExpenses: string[];
  onSelect: (id: string) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  userCategories,
  onSave,
  onCancel,
  isEditing,
  selectedExpenses,
  onSelect,
}) => {
  const [formData, setFormData] = useState<ExpenseItem>(expense);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'date' && value
          ? new Date(
              new Date(value).toLocaleString('en-US', { timeZone: 'UTC' })
            )
          : value,
    }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.cost) {
      alert('Name and cost are required!');
      return;
    }
    onSave(formData);
  };

  return (
    <>
      {isEditing && (
        <td>
          <Form.Check
            aria-label="select"
            className={styles.customCheck}
            checked={selectedExpenses.includes(formData._id)}
            onChange={() => onSelect(formData._id)}
          />
        </td>
      )}
      <td>
        <Form.Control
          type="date"
          name="date"
          value={
            formData.date
              ? new Date(formData.date).toLocaleDateString('en-CA') // Localized to YYYY-MM-DD
              : ''
          }
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          autoFocus={!isEditing}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Select
          name="categoryName"
          value={formData.categoryName}
          onChange={handleDropdownChange}
        >
          <option value="">Category (None)</option>
          {userCategories.map((category) => (
            <option key={category.categoryId} value={category.categoryName}>
              {category.icon} {category.categoryName}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Control
          type="number"
          name="cost"
          placeholder="Cost"
          value={formData.cost}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <div className={styles.actionItems}>
          <Button variant="success" size="sm" onClick={handleSubmit}>
            <CheckLg />
          </Button>
          <Button variant="danger" size="sm" onClick={onCancel}>
            <XLg />
          </Button>
        </div>
      </td>
    </>
  );
};

export default ExpenseForm;
