import Header from '../../components/header/Header';
import CategorySection from './CategorySection';

import './../../styles/shared.css';

function CategoriesList() {
  return (
    <>
      <div className="app">
        <div className="app-header">
          <Header />
        </div>
        <div className="app-body">
          <CategorySection categoryType="expense"></CategorySection>
          <CategorySection categoryType="income"></CategorySection>
        </div>
      </div>
    </>
  );
}

export default CategoriesList;
