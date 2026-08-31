import { createSelector } from "@reduxjs/toolkit";
import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";

export const getFilters = (state: Pick<TState, typeof NameSpace.Filter>) =>
  state[NameSpace.Filter].filters;

export const getCurrentCategory = (
  state: Pick<TState, typeof NameSpace.Filter>,
) => state[NameSpace.Filter].currentCategory;

export const getCurrentTypes = (state: Pick<TState, typeof NameSpace.Filter>) =>
  state[NameSpace.Filter].currentTypes;

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
      return [];
    }

    return (
      filters.find((filter) => filter.category === currentCategory)?.types ?? []
    );
  },
);
