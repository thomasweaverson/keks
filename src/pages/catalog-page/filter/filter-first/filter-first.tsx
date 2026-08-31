import clsx from "clsx";
import { ProductCategoryLabel } from "../../../../const/business";
import type { TProductCategory } from "../../../../types/product";
import { useAppDispatch } from "../../../../hooks";
import { setCategory } from "../../../../store/slices/filter/filter.slice";

type TFilterFirstProps = {
  categories: TProductCategory[];
  current: TProductCategory | null;
};

const FilterFirst = ({ categories, current }: TFilterFirstProps) => {
  const dispatch = useAppDispatch();
  const handleFilterChange = (category: TProductCategory) => {
    if (current === category) {
      dispatch(setCategory(null));
      return;
    }
    dispatch(setCategory(category));
  };
  return (
    <div className="catalog-filter__first-level">
      <h3 className="catalog-filter__title catalog-filter__title--first-level">
        основы
      </h3>
      <ul className="catalog-filter__list catalog-filter__list--first-level">
        {categories.map((category) => (
          <li className="catalog-filter__item catalog-filter__item--first-level">
            <button
              className={clsx("btn", "btn--filter-first-level", {
                "is-active": category === current,
              })}
              type="button"
              onClick={(evt) => {
                evt.preventDefault();
                handleFilterChange(category);
              }}
            >
              {ProductCategoryLabel[category]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterFirst;
