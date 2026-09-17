import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import FilterSortBar from './filter-sort-bar';
import { ReviewsFilter, SortOrder } from '../../../../const/business';
import {
  setReviewsFilter,
  setReviewsSortOrder,
} from '../../../../store/slices/reviews/reviews.slice';
import { withStore } from '../../../../utils/testing/mock-components';
import { makeFakeReview } from '../../../../utils/testing/mocks';
import { LoadingStatus } from '../../../../const/infrastructure';

describe('Component: FilterSortBar', () => {
  it('should render current filter and sort order', () => {
    const { withStoreComponent } = withStore(<FilterSortBar />, {
      Reviews: {
        currentReviewsFilter: ReviewsFilter.High,
        currentReviewsSortOrder: SortOrder.OLDEST,
        lastReview: makeFakeReview(),
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(
      screen.getByRole('button', { name: ReviewsFilter.High }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: ReviewsFilter.Any }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: ReviewsFilter.High }),
    ).toBeChecked();

    expect(
      screen.getByRole('radio', { name: ReviewsFilter.Low }),
    ).not.toBeChecked();

    expect(
      screen.getByRole('button', {
        name: 'сортировка по возрастанию',
      }),
    ).not.toHaveClass('filter-sort__sort-btn--active');

    expect(
      screen.getByRole('button', {
        name: 'сортировка по убыванию',
      }),
    ).toHaveClass('filter-sort__sort-btn--active');
  });

  it('should dispatch action when review filter is changed', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(<FilterSortBar />, {
      Reviews: {
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: makeFakeReview(),
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    await user.click(screen.getByRole('radio', { name: ReviewsFilter.High }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      setReviewsFilter(ReviewsFilter.High),
    );
  });

  it('should not dispatch action when current review filter is selected', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(<FilterSortBar />, {
      Reviews: {
        currentReviewsFilter: ReviewsFilter.High,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: makeFakeReview(),
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    await user.click(screen.getByRole('radio', { name: ReviewsFilter.High }));

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch action when sort order is changed to newest', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(<FilterSortBar />, {
      Reviews: {
        currentReviewsSortOrder: SortOrder.OLDEST,
        currentReviewsFilter: ReviewsFilter.Any,
        lastReview: makeFakeReview(),
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', {
        name: 'сортировка по возрастанию',
      }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      setReviewsSortOrder(SortOrder.NEWEST),
    );
  });

  it('should dispatch action when sort order is changed to oldest', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(<FilterSortBar />, {
      Reviews: {
        currentReviewsSortOrder: SortOrder.NEWEST,
        currentReviewsFilter: ReviewsFilter.Any,
        lastReview: makeFakeReview(),
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', {
        name: 'сортировка по убыванию',
      }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      setReviewsSortOrder(SortOrder.OLDEST),
    );
  });

  it('should not dispatch action when current sort order is selected', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore } = withStore(<FilterSortBar />, {
      Reviews: {
        currentReviewsSortOrder: SortOrder.NEWEST,
        currentReviewsFilter: ReviewsFilter.Any,
        lastReview: makeFakeReview(),
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', {
        name: 'сортировка по возрастанию',
      }),
    );

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
