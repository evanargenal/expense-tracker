import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CheckLg, XLg } from 'react-bootstrap-icons';

import { Category } from '../../../types/types';

import styles from '../TableStyle.module.css';

interface CategoryFormProps {
  category: Category;
  onSave: (category: Category) => void;
  onCancel: () => void;
  isEditing: boolean;
  selectedCategories: string[];
  onSelect: (id: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel,
  isEditing,
  selectedCategories,
  onSelect,
}) => {
  const [formData, setFormData] = useState<Category>(category);

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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.categoryName) {
      alert('Category name is required!');
      return;
    }
    onSave(formData);
  };

  return (
    <tr onKeyDown={handleKeyDown}>
      {isEditing && (
        <td>
          <Form.Check
            aria-label="select"
            className={styles.customCheck}
            checked={selectedCategories.includes(formData._id)}
            onChange={() => onSelect(formData._id)}
          />
        </td>
      )}
      <td colSpan={isEditing ? 3 : 1}>
        <Form.Control
          type="text"
          name="categoryName"
          placeholder="Name"
          value={formData.categoryName}
          onChange={handleInputChange}
          autoFocus
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="icon"
          placeholder="Icon"
          value={formData.icon}
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
    </tr>
  );
};

export default CategoryForm;
