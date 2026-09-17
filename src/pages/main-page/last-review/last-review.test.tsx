import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LastReview from './last-review';
import { LoadingStatus } from '../../../const/infrastructure';
import { withStore } from '../../../utils/testing/mock-components';
import { makeFakeReview, makeFakeState } from '../../../utils/testing/mocks';

describe('Component: LastReview', () => {
  it('should render loader while last review is loading', () => {
    const { withStoreComponent } = withStore(
      <LastReview />,
      makeFakeState({
        Reviews: {
          ...makeFakeState().Reviews,
          lastReview: null,
          lastReviewLoadingStatus: LoadingStatus.Loading,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should not render content when loading has failed', () => {
    const { withStoreComponent } = withStore(
      <LastReview />,
      makeFakeState({
        Reviews: {
          ...makeFakeState().Reviews,
          lastReview: null,
          lastReviewLoadingStatus: LoadingStatus.Failed,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.queryByRole('heading', { name: 'последний отзыв' }),
    ).not.toBeInTheDocument();
  });

  it('should not render content when last review is absent', () => {
    const { withStoreComponent } = withStore(
      <LastReview />,
      makeFakeState({
        Reviews: {
          ...makeFakeState().Reviews,
          lastReview: null,
          lastReviewLoadingStatus: LoadingStatus.Idle,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.queryByRole('heading', { name: 'последний отзыв' }),
    ).not.toBeInTheDocument();
  });

  it('should render last review when it is available', () => {
    const lastReview = makeFakeReview();

    const { withStoreComponent } = withStore(
      <LastReview />,
      makeFakeState({
        Reviews: {
          ...makeFakeState().Reviews,
          lastReview,
          lastReviewLoadingStatus: LoadingStatus.Loaded,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', { name: 'последний отзыв' }),
    ).toBeInTheDocument();
  });
});
