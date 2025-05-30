import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CheckLg, XLg } from 'react-bootstrap-icons';

import { Category } from '../../../types/types';
import { useCategoryType } from '../../../context/CategoryTypeContext';

import styles from '../TableStyle.module.css';

interface CategoryFormProps {
  category: Category;
  isEditing: boolean;
  selectedCategories: string[];
  onSave: (category: Category) => void;
  onCancel: () => void;
  onSelect: (id: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  isEditing,
  selectedCategories,
  onSave,
  onCancel,
  onSelect,
}) => {
  const categoryType = useCategoryType();
  const [formData, setFormData] = useState<Category>({
    ...category,
    categoryType,
  });

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
        <td style={{ width: '5%' }}>
          <Form.Check
            aria-label="select"
            className={styles['table__custom-check']}
            checked={selectedCategories.includes(formData._id)}
            onChange={() => onSelect(formData._id)}
          />
        </td>
      )}
      <td style={{ width: '40%' }}>
        <Form.Control
          type="text"
          name="categoryName"
          placeholder="Name (Required)"
          value={formData.categoryName}
          onChange={handleInputChange}
          autoFocus
        />
      </td>
      <td style={{ width: '10%' }}>
        <Form.Control
          type="text"
          name="icon"
          placeholder="Icon"
          value={formData.icon}
          onChange={handleInputChange}
        />
      </td>
      {isEditing && (
        <>
          <td style={{ width: '15%' }}>{category.numMatchedItems}</td>
          <td style={{ width: '15%' }}>
            {category.userId === '000000000000000000000000' ? (
              <XLg />
            ) : (
              <CheckLg />
            )}
          </td>
        </>
      )}
      <td style={{ width: '10%' }}>
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

export default CategoryForm;
