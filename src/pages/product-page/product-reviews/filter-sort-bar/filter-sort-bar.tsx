
import clsx from "clsx";
import { ReviewsFilter, SortOrder } from "../../../../const/business";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { getCurrentReviewsFilter, getCurrentReviewsSortOrder } from "../../../../store/slices/reviews/reviews.selectors";
import { setReviewsFilter, setReviewsSortOrder } from "../../../../store/slices/reviews/reviews.slice";
import type { TReviewsFilter, TReviewsSortOrder } from "../../../../types/business";

const reviewFilters: [string, TReviewsFilter][] = Object.entries(ReviewsFilter);

const FilterSortBar = () => {
  const dispatch = useAppDispatch();

  const currentFilter = useAppSelector(getCurrentReviewsFilter);
  const currentSortOrder = useAppSelector(getCurrentReviewsSortOrder);

  const handleFilterChange = (filter: TReviewsFilter) => {
    if (currentFilter === filter) {
      return;
    }
    dispatch(setReviewsFilter(filter));
  };

  const handleSortOrderChange = (sortOrder: TReviewsSortOrder) => {
    if (currentSortOrder === sortOrder) {
      return;
    }
    dispatch(setReviewsSortOrder(sortOrder));
  };

  return (
    <div className="filter-sort">
      <div className="container">
        <div className="filter-sort__inner">
          <div className="filter-sort__filter-wrap">
            <h3 className="filter-sort__filter-title">Показать с рейтингом</h3>
            <div className="filter-sort__filter">
              <button className="filter-sort__filter-btn" type="button">
                {currentFilter}
                <svg
                  className="filter-sort__filter-icon"
                  width="14"
                  height="15"
                  aria-hidden="true"
                >
                  <use href="#icon-polygon"></use>
                </svg>
              </button>
              <ul className="filter-sort__filter-list">
                {reviewFilters .map(([filter, label]) => {
                  const filterId = filter.toLowerCase();
                  return (
                    <li className="filter-sort__filter-item" key={filter}>
                      <div className="custom-toggle custom-toggle--sorting">
                        <input
                          type="radio"
                          id={filterId}
                          name="review-sort"
                          checked={currentFilter === label}
                          onChange={() => handleFilterChange(label)}
                        />
                        <label
                          className="custom-toggle__label"
                          htmlFor={filterId}
                        >
                          {label}
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="filter-sort__sort-wrap">
            <h3 className="filter-sort__sort-title">Сортировать по дате</h3>
            <div className="filter-sort__sort-btns-wrap">
              <button
                className={clsx(
                  "filter-sort__sort-btn",
                  "filter-sort__sort-btn--inc",
                  {
                    "filter-sort__sort-btn--active":
                      currentSortOrder === SortOrder.NEWEST,
                  },
                )}
                type="button"
                aria-label="сортировка по возрастанию"
                onClick={() => handleSortOrderChange(SortOrder.NEWEST)}
              >
                <svg
                  className="filter-sort__sort-icon"
                  width="19"
                  height="13"
                  aria-hidden="true"
                >
                  <use href="#icon-chevron-top"></use>
                </svg>
              </button>
              <button
                className={clsx(
                  "filter-sort__sort-btn",
                  "filter-sort__sort-btn--desc",
                  {
                    "filter-sort__sort-btn--active":
                      currentSortOrder === SortOrder.OLDEST,
                  },
                )}
                type="button"
                aria-label="сортировка по убыванию"
                onClick={() => handleSortOrderChange(SortOrder.OLDEST)}
              >
                <svg
                  className="filter-sort__sort-icon"
                  width="19"
                  height="13"
                  aria-hidden="true"
                >
                  <use href="#icon-chevron-top"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSortBar;
