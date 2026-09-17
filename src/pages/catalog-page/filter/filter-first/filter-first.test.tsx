import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductCategoryLabel } from '../../../../const/business';
import type { TProductCategory } from '../../../../types/product';
import { setCategory } from '../../../../store/slices/filter/filter.slice';
import FilterFirst from './filter-first';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../../../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

describe('Component: FilterFirst', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const categories: TProductCategory[] = ['cheesecake', 'bisque', 'shortbread'];

  it('should render all categories', () => {
    render(<FilterFirst categories={categories} current={null} />);

    categories.forEach((category) => {
      expect(
        screen.getByRole('button', {
          name: ProductCategoryLabel[category],
        }),
      ).toBeInTheDocument();
    });
  });

  it('should mark current category as active', () => {
    const current = categories[1];

    render(<FilterFirst categories={categories} current={current} />);

    expect(
      screen.getByRole('button', {
        name: ProductCategoryLabel[current],
      }),
    ).toHaveClass('is-active');

    expect(
      screen.getByRole('button', {
        name: ProductCategoryLabel[categories[0]],
      }),
    ).not.toHaveClass('is-active');
  });

  it('should dispatch selected category when clicking inactive category', async () => {
    const user = userEvent.setup();

    render(<FilterFirst categories={categories} current={null} />);

    await user.click(
      screen.getByRole('button', {
        name: ProductCategoryLabel[categories[0]],
      }),
    );

    expect(mockDispatch).toHaveBeenCalledWith(setCategory(categories[0]));
  });

  it('should reset category when clicking current category', async () => {
    const user = userEvent.setup();
    const current = categories[0];

    render(<FilterFirst categories={categories} current={current} />);

    await user.click(
      screen.getByRole('button', {
        name: ProductCategoryLabel[current],
      }),
    );

    expect(mockDispatch).toHaveBeenCalledWith(setCategory(null));
  });
});
