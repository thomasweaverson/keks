import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import NotFoundReviews from './not-found-reviews';
import { resetFiltersAndSorting } from '../../../../store/slices/reviews/reviews.slice';
import { withStore } from '../../../../utils/testing/mock-components';

describe('Component: NotFoundReviews', () => {
  it('should render not found message and reset button', () => {
    const { withStoreComponent } = withStore(<NotFoundReviews />);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        name: 'По вашему запросу информации не найдено',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Сбросить фильтры',
      }),
    ).toBeInTheDocument();
  });

  it('should dispatch reset action when reset button is clicked', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(<NotFoundReviews />);
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', {
        name: 'Сбросить фильтры',
      }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(resetFiltersAndSorting());
  });
});
