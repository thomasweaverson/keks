import { useAppDispatch } from "../../../../hooks";
import { toggleType } from "../../../../store/slices/filter/filter.slice";
import { getProductTypeLabel } from "./utils";

type TFilterSecondProps = {
  types: string[];
  currentTypes: string[];
};

const FilterSecond = ({ types, currentTypes }: TFilterSecondProps) => {
  const dispatch = useAppDispatch();
  return (
    <div className="catalog-filter__second-level">
      <h3 className="catalog-filter__title catalog-filter__title--second-level">
        начинки
      </h3>
      <ul className="catalog-filter__list catalog-filter__list--second-level">
        {types.map((productType) => (
          <li className="catalog-filter__item catalog-filter__item--second-level">
            <div className="custom-toggle custom-toggle--checkbox">
              <input
                type="checkbox"
                value={productType}
                id={`catalog-second-level-id-${productType}`}
                name="catalog-second-level"
                checked={currentTypes.includes(productType)}
              />
              <label
                className="custom-toggle__label"
                htmlFor={`catalog-second-level-id-${productType}`}
                onClick={(evt) => {
                  evt.preventDefault();
                  dispatch(toggleType(productType));
                }}
              >
                {getProductTypeLabel(productType)}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterSecond;
