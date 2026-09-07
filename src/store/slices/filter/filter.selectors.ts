import { createSelector } from "@reduxjs/toolkit";
import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";
import type { TProductType } from "../../../types/product";

const EMPTY_TYPES: TProductType[] = [];

export const getFilters = (state: Pick<TState, typeof NameSpace.Filter>) =>
  state[NameSpace.Filter].filters;

export const getCurrentCategory = (
  state: Pick<TState, typeof NameSpace.Filter>,
) => state[NameSpace.Filter].currentCategory;

export const getSelectedTypes = (state: Pick<TState, typeof NameSpace.Filter>) =>
  state[NameSpace.Filter].currentTypes;

export const getIsFiltersLoading = (
  state: Pick<TState, typeof NameSpace.Filter>,
) => state[NameSpace.Filter].isFiltersLoading;

export const getIsFiltersLoadingError = (
  state: Pick<TState, typeof NameSpace.Filter>,
) => state[NameSpace.Filter].isFiltersLoadingError;

export const getCategories = createSelector([getFilters], (filters) =>
  filters.map((filter) => filter.category),
);

export const getTypesByCurrentCategory = createSelector(
  [getFilters, getCurrentCategory],
  (filters, currentCategory) => {
    if (!currentCategory) {
      return EMPTY_TYPES;
    }

    return (
      filters.find((filter) => filter.category === currentCategory)?.types ?? EMPTY_TYPES
    );
  },
);
