import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import ReviewsLoadingError from './reviews-loading-error';
import { LoadingStatus } from '../../../../const/infrastructure';
import { withStore } from '../../../../utils/testing/mock-components';
import { ReviewsFilter, SortOrder } from '../../../../const/business';

describe('Component: ReviewsLoadingError', () => {
  it('should render active reload button', () => {
    const { withStoreComponent } = withStore(<ReviewsLoadingError />);

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={withStoreComponent} />
        </Routes>
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', {
      name: 'Попробовать ещё',
    });

    expect(button).toBeEnabled();
    expect(button).not.toHaveClass('is-disabled');
  });

  it('should disable reload button when reviews are loading', () => {
    const { withStoreComponent } = withStore(<ReviewsLoadingError />, {
      Reviews: {
        reviewsLoadingStatus: LoadingStatus.Loading,
        reviews: [],
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Loading,
      },
    });

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={withStoreComponent} />
        </Routes>
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', {
      name: 'Попробовать ещё',
    });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('is-disabled');
  });

  it('should dispatch action when reload button is clicked', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(
      <ReviewsLoadingError />,
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(
      <MemoryRouter initialEntries={['/product/123']}>
        <Routes>
          <Route path="/product/:id" element={withStoreComponent} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Попробовать ещё',
      }),
    );

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not dispatch action when product id is missing', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(
      <ReviewsLoadingError />,
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(
      <MemoryRouter initialEntries={['/reviews']}>
        <Routes>
          <Route path="/reviews" element={withStoreComponent} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Попробовать ещё',
      }),
    );

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
