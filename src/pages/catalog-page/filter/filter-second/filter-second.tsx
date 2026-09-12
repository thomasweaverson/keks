import { useAppDispatch } from '../../../../hooks';
import { toggleType } from '../../../../store/slices/filter/filter.slice';
import type { TProductType } from '../../../../types/product';
import { getProductTypeLabel } from './utils';

type TFilterSecondProps = {
  types: TProductType[];
  currentTypes: TProductType[];
};

const FilterSecond = ({ types, currentTypes }: TFilterSecondProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="catalog-filter__second-level">
      <h3 className="catalog-filter__title catalog-filter__title--second-level">
        начинки
      </h3>

      <ul className="catalog-filter__list catalog-filter__list--second-level">
        {types.map((productType) => {
          const inputId = `catalog-second-level-id-${productType}`;

          return (
            <li
              className="catalog-filter__item catalog-filter__item--second-level"
              key={productType}
            >
              <div className="custom-toggle custom-toggle--checkbox">
                <input
                  type="checkbox"
                  value={productType}
                  id={inputId}
                  name="catalog-second-level"
                  checked={currentTypes.includes(productType)}
                  onChange={() => dispatch(toggleType(productType))}
                />

                <label className="custom-toggle__label" htmlFor={inputId}>
                  {getProductTypeLabel(productType)}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterSecond;
