import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CheckLg, XLg } from 'react-bootstrap-icons';

import { ExpenseItem, Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface ExpenseFormProps {
  expense: ExpenseItem;
  userExpenseCategories: Category[];
  isEditing: boolean;
  selectedExpenses: string[];
  onSave: (expense: ExpenseItem) => void;
  onCancel: () => void;
  onSelect: (id: string) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  userExpenseCategories,
  isEditing,
  selectedExpenses,
  onSave,
  onCancel,
  onSelect,
}) => {
  const [formData, setFormData] = useState<ExpenseItem>(expense);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents unwanted default behavior
      handleSubmit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

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
    <tr onKeyDown={handleKeyDown}>
      {isEditing && (
        <td className={styles['table__custom-check-container']}>
          <Form.Check
            aria-label="select"
            className={styles['table__custom-check']}
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
          placeholder="Name (Required)"
          value={formData.name}
          onChange={handleInputChange}
          autoFocus
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
          name="categoryId"
          value={formData.categoryId}
          onChange={handleDropdownChange}
        >
          <option value="">Category (None)</option>
          {userExpenseCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.icon} {category.categoryName}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Control
          type="number"
          name="cost"
          placeholder="Cost (Required)"
          value={formData.cost}
          onChange={handleInputChange}
        />
      </td>
      <td className={styles['table__action-items-container']}>
        <div className={styles['table__action-items']}>
          <Button variant="success" size="sm" onClick={handleSubmit}>
            <CheckLg />
          </Button>
          <Button variant="danger" size="sm" onClick={onCancel}>
            <XLg />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseForm;
