const emojiRegex = require('emoji-regex');

export const validateDate = (date: any): Date | null => {
  if (typeof date !== 'string') {
    return null; // Invalid type
  }

  if (date === null || date === '') {
    return null; // Null or empty string
  }

  const parsedDate = Date.parse(date);
  if (isNaN(parsedDate)) {
    return null; // Invalid date string
  }

  return new Date(date); // Valid date
};

export const validateNumber = (inputNumber: any): number | null => {
  if (typeof inputNumber !== 'number' || isNaN(inputNumber)) {
    return null; // Invalid input number
  }
  return inputNumber;
};

export const validateSingleEmoji = (icon: string): boolean => {
  if (icon === '') return true; // Allow empty string as valid

  if (typeof icon !== 'string') return false;

  const regex = emojiRegex();
  const matches = [...icon.matchAll(regex)].map((match) => match[0]);

  return matches.length === 1 && matches[0] === icon;
};
