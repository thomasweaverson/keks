import { describe, expect, it } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import { fetchFiltersAction } from '../../api-actions';
import { makeFakeCategoryWithTypes } from '../../../utils/testing/mocks';
import {
  filterSlice,
  resetFilter,
  setCategory,
  toggleType,
} from './filter.slice';
import type { TFilterState } from '../../../types/state';

describe('Filter slice', () => {
  it('returns initial state without previous state', () => {
    expect(filterSlice.reducer(undefined, { type: '@@INIT' })).toEqual({
      filters: [],
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Idle,
    });
  });

  it('handles resetFilter', () => {
    const filters = [makeFakeCategoryWithTypes()];

    const state: TFilterState = {
      filters,
      currentCategory: 'cheesecake',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(filterSlice.reducer(state, resetFilter())).toEqual({
      filters,
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('handles setCategory with a new category', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'cheesecake',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(filterSlice.reducer(state, setCategory('bisque'))).toEqual({
      filters: [],
      currentCategory: 'bisque',
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('handles setCategory with null', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'cheesecake',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(filterSlice.reducer(state, setCategory(null))).toEqual({
      filters: [],
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('does not reset types when setCategory receives the current category', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'cheesecake',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(filterSlice.reducer(state, setCategory('cheesecake'))).toEqual(
      state,
    );
  });

  it('adds a type with toggleType', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'bisque',
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Idle,
    };

    expect(filterSlice.reducer(state, toggleType('vegetarian'))).toEqual({
      filters: [],
      currentCategory: 'bisque',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Idle,
    });
  });

  it('removes an existing type with toggleType', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'bisque',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Idle,
    };
    expect(filterSlice.reducer(state, toggleType('vegetarian'))).toEqual({
      filters: [],
      currentCategory: 'bisque',
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Idle,
    });
  });

  it('handles fetchFiltersAction.pending', () => {
    const state = {
      filters: [],
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Idle,
    };

    const action = fetchFiltersAction.pending('request-id', undefined);

    expect(filterSlice.reducer(state, action)).toEqual({
      filters: [],
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loading,
    });
  });

  it('handles fetchFiltersAction.fulfilled', () => {
    const filters = [
      makeFakeCategoryWithTypes('cheesecake', ['vegetarian', 'chocolate']),
      makeFakeCategoryWithTypes('bisque', ['lemon']),
    ];

    const state = {
      filters: [],
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loading,
    };

    const action = fetchFiltersAction.fulfilled(
      filters,
      'request-id',
      undefined,
    );

    expect(filterSlice.reducer(state, action)).toEqual({
      filters,
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('handles fetchFiltersAction.rejected', () => {
    const filters = [makeFakeCategoryWithTypes()];

    const state: TFilterState = {
      filters,
      currentCategory: 'cheesecake',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Loading,
    };

    const action = fetchFiltersAction.rejected(
      new Error('Request failed'),
      'request-id',
      undefined,
    );

    expect(filterSlice.reducer(state, action)).toEqual({
      filters,
      currentCategory: 'cheesecake',
      currentTypes: ['vegetarian'],
      filtersLoadingStatus: LoadingStatus.Failed,
    });
  });
});
