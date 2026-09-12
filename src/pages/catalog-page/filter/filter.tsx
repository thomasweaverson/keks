import { useAppSelector } from '../../../hooks';
import {
  getCategories,
  getCurrentCategory,
  getSelectedTypes,
  getTypesByCurrentCategory,
} from '../../../store/slices/filter/filter.selectors';
import FilterFirst from './filter-first/filter-first';
import FilterSecond from './filter-second/filter-second';

const Filter = () => {
  const currentCategory = useAppSelector(getCurrentCategory);
  const categoryTypes = useAppSelector(getTypesByCurrentCategory);
  const selectedTypes = useAppSelector(getSelectedTypes);
  const categories = useAppSelector(getCategories);

  return (
    <div className="catalog-filter">
      <div className="container">
        <FilterFirst categories={categories} current={currentCategory} />
        {currentCategory && (
          <FilterSecond types={categoryTypes} currentTypes={selectedTypes} />
        )}
      </div>
    </div>
  );
};

export default Filter;
