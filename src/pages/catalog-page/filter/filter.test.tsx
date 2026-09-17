import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type {
  TProductCategory,
  TProductType,
} from '../../../types/product';

import Filter from './filter';
import { withStore } from '../../../utils/testing/mock-components';
import { makeFakeState } from '../../../utils/testing/mocks';

vi.mock('./filter-first/filter-first', () => ({
  default: ({
    categories,
    current,
  }: {
    categories: TProductCategory[];
    current: TProductCategory | null;
  }) => (
    <div data-testid="filter-first">
      <span>{categories.join(',')}</span>
      <span>{current ?? 'no-current-category'}</span>
    </div>
  ),
}));

vi.mock('./filter-second/filter-second', () => ({
  default: ({
    types,
    currentTypes,
  }: {
    types: TProductType[];
    currentTypes: TProductType[];
  }) => (
    <div data-testid="filter-second">
      <span>{types.join(',')}</span>
      <span>{currentTypes.join(',')}</span>
    </div>
  ),
}));

describe('Component: Filter', () => {
  it('should render FilterFirst with categories and current category', () => {
    const currentCategory: TProductCategory = 'cheesecake';

    const { withStoreComponent } = withStore(
      <Filter />,
      {
        Filter: {
          ...makeFakeState().Filter,
          filters: [
            {
              category: 'cheesecake',
              types: ['chocolate'],
            },
            {
              category: 'bisque',
              types: ['tart'],
            },
          ],
          currentCategory,
        },
      },
    );

    render(withStoreComponent);

    expect(screen.getByTestId('filter-first')).toHaveTextContent(
      'cheesecake,bisque',
    );
    expect(screen.getByTestId('filter-first')).toHaveTextContent(
      currentCategory,
    );
  });

  it('should not render FilterSecond when category is not selected', () => {
    const { withStoreComponent } = withStore(
      <Filter />,
      {
        Filter: {
          ...makeFakeState().Filter,
          filters: [
            {
              category: 'cheesecake',
              types: ['chocolate'],
            },
            {
              category: 'bisque',
              types: ['lemon'],
            },
          ],
          currentCategory: null,
        },
      },
    );

    render(withStoreComponent);

    expect(screen.getByTestId('filter-first')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-second')).not.toBeInTheDocument();
  });

  it('should render FilterSecond with types of current category and selected types', () => {
    const currentTypes: TProductType[] = ['tart'];

    const { withStoreComponent } = withStore(
      <Filter />,
      {
        Filter: {
          ...makeFakeState().Filter,
          filters: [
            {
              category: 'cheesecake',
              types: ['tart', 'lemon'],
            },
            {
              category: 'bisque',
              types: ['tart'],
            },
          ],
          currentCategory: 'cheesecake',
          currentTypes,
        },
      },
    );

    render(withStoreComponent);

    expect(screen.getByTestId('filter-second')).toHaveTextContent(
      'tart,lemon',
    );
    expect(screen.getByTestId('filter-second')).toHaveTextContent('tart');
  });
});
