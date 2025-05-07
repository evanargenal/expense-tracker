import { createContext, useContext } from 'react';

export const CategoryTypeContext = createContext<string | null>(null);

export const useCategoryType = () => {
  const context = useContext(CategoryTypeContext);
  if (!context) {
    throw new Error(
      'useCategoryType must be used within a CategoryTypeProvider'
    );
  }
  return context;
};
