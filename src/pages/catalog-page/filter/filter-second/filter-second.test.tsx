import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toggleType } from '../../../../store/slices/filter/filter.slice';
import type { TProductType } from '../../../../types/product';
import FilterSecond from './filter-second';
import { getProductTypeLabel } from './utils';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../../../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

describe('Component: FilterSecond', () => {
  const types: TProductType[] = ['lemon', 'chocolate', 'vanilla'];
  const currentTypes: TProductType[] = ['lemon'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all product types', () => {
    render(
      <FilterSecond
        types={types}
        currentTypes={currentTypes}
      />,
    );

    types.forEach((type) => {
      expect(
        screen.getByRole('checkbox', {
          name: getProductTypeLabel(type),
        }),
      ).toBeInTheDocument();
    });
  });

  it('should check types included in currentTypes', () => {
    render(
      <FilterSecond
        types={types}
        currentTypes={currentTypes}
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: getProductTypeLabel('lemon'),
      }),
    ).toBeChecked();

    expect(
      screen.getByRole('checkbox', {
        name: getProductTypeLabel('chocolate'),
      }),
    ).not.toBeChecked();

    expect(
      screen.getByRole('checkbox', {
        name: getProductTypeLabel('vanilla'),
      }),
    ).not.toBeChecked();
  });

  it('should dispatch toggleType when checkbox is changed', async () => {
    const user = userEvent.setup();

    render(
      <FilterSecond
        types={types}
        currentTypes={currentTypes}
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: getProductTypeLabel('chocolate'),
    });

    await user.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledWith(toggleType('chocolate'));
  });

  it('should dispatch toggleType when checked checkbox is changed', async () => {
    const user = userEvent.setup();

    render(
      <FilterSecond
        types={types}
        currentTypes={currentTypes}
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: getProductTypeLabel('lemon'),
    });

    await user.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledWith(toggleType('lemon'));
  });
});
