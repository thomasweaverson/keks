import { describe, expect, it } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import { makeFakeCategoryWithTypes } from '../../../utils/testing/mocks';
import type { TFilterState } from '../../../types/state';
import {
  getCategories,
  getCurrentCategory,
  getFilters,
  getFiltersLoadingStatus,
  getSelectedTypes,
  getTypesByCurrentCategory,
} from './filter.selectors';

describe('Filter selectors', () => {
  it('returns filters', () => {
    const filters = [
      makeFakeCategoryWithTypes('cheesecake', ['lemon', 'chocolate']),
      makeFakeCategoryWithTypes('bisque', ['vanilla']),
    ];

    const state: TFilterState = {
      filters,
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(getFilters({ Filter: state })).toBe(filters);
  });

  it('returns current category', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'cheesecake',
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Idle,
    };

    expect(getCurrentCategory({ Filter: state })).toBe('cheesecake');
  });

  it('returns selected types', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: 'cheesecake',
      currentTypes: ['lemon', 'chocolate'],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(getSelectedTypes({ Filter: state })).toEqual([
      'lemon',
      'chocolate',
    ]);
  });
  it('returns filters loading status', () => {
    const state: TFilterState = {
      filters: [],
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loading,
    };

    expect(getFiltersLoadingStatus({ Filter: state })).toBe(
      LoadingStatus.Loading,
    );
  });

  it('returns categories from filters', () => {
    const filters = [
      makeFakeCategoryWithTypes('cheesecake'),
      makeFakeCategoryWithTypes('bisque'),
      makeFakeCategoryWithTypes('shortbread'),
    ];

    const state: TFilterState = {
      filters,
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(getCategories({ Filter: state })).toEqual([
      'cheesecake',
      'bisque',
      'shortbread',
    ]);
  });

  it('returns empty types when current category is not selected', () => {
    const filters = [
      makeFakeCategoryWithTypes('cheesecake', ['lemon', 'chocolate']),
    ];

    const state: TFilterState = {
      filters,
      currentCategory: null,
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(getTypesByCurrentCategory({ Filter: state })).toEqual([]);
  });

  it('returns types of the current category', () => {
    const filters = [
      makeFakeCategoryWithTypes('cheesecake', ['lemon', 'chocolate']),
      makeFakeCategoryWithTypes('bisque', ['vanilla']),
    ];

    const state: TFilterState = {
      filters,
      currentCategory: 'cheesecake',
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(getTypesByCurrentCategory({ Filter: state })).toEqual([
      'lemon',
      'chocolate',
    ]);
  });

  it('returns empty types when current category is not found in filters', () => {
    const filters = [
      makeFakeCategoryWithTypes('cheesecake', ['lemon', 'chocolate']),
    ];

    const state: TFilterState = {
      filters,
      currentCategory: 'bisque',
      currentTypes: [],
      filtersLoadingStatus: LoadingStatus.Loaded,
    };

    expect(getTypesByCurrentCategory({ Filter: state })).toEqual([]);
  });
});
