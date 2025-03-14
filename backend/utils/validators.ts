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

export const validateCost = (cost: any): number | null => {
  if (typeof cost !== 'number' || isNaN(cost)) {
    return null; // Invalid number
  }
  return cost;
};
