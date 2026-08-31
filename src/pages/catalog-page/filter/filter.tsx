import { useAppSelector } from "../../../hooks";
import {
  getCategories,
  getCurrentCategory,
  getCurrentTypes,
  getTypesByCurrentCategory,
} from "../../../store/slices/filter/filter.selectors";
import FilterFirst from "./filter-first/filter-first";
import FilterSecond from "./filter-second/filter-second";

const Filter = () => {
  const currentCategory = useAppSelector(getCurrentCategory);
  const typesByCategory = useAppSelector(getTypesByCurrentCategory);
  const currentTypes = useAppSelector(getCurrentTypes);
  const categories = useAppSelector(getCategories);

  return (
    <div className="catalog-filter">
      <div className="container">
        <FilterFirst categories={categories} current={currentCategory} />
        {currentCategory && (
          <FilterSecond types={typesByCategory} currentTypes={currentTypes} />
        )}
      </div>
    </div>
  );
};

export default Filter;
