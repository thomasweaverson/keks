import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ReviewCard from './review-card';
import { makeFakeReview } from '../../utils/testing/mocks';

vi.mock('../star-rating/star-rating', () => ({
  default: ({ rating }: { rating: number }) => (
    <div data-testid="star-rating">{rating}</div>
  ),
}));

vi.mock('./utils', () => ({
  formatReviewDate: (date: string) => `Formatted: ${date}`,
  getReviewDateTime: (date: string) => `ISO: ${date}`,
}));

describe('Component: ReviewCard', () => {
  it('renders review info correctly with formatted date and user avatar', () => {
    const fakeReview = makeFakeReview({
      user: {
        name: 'Иван Иванов',
        avatarUrl: 'img/content/avatar.jpg',
      },
      positive: 'Отличный товар',
      negative: 'Долгая доставка',
      rating: 4,
      isoDate: '2026-03-15T12:00:00.000Z',
    });

    const { container } = render(<ReviewCard review={fakeReview} />);

    expect(
      screen.getByText(`Уважаемый(-ая) ${fakeReview.user.name}`),
    ).toBeInTheDocument();
    expect(screen.getByText('Отличный товар')).toBeInTheDocument();
    expect(screen.getByText('Долгая доставка')).toBeInTheDocument();

    const timeElement = container.querySelector('time');
    expect(timeElement).toHaveTextContent(`Formatted: ${fakeReview.isoDate}`);
    expect(timeElement).toHaveAttribute(
      'dateTime',
      `ISO: ${fakeReview.isoDate}`,
    );

    const avatarImage = screen.getByTestId('avatar-image');
    expect(avatarImage).toHaveAttribute('src', fakeReview.user.avatarUrl);

    expect(screen.getByTestId('star-rating')).toHaveTextContent('4');
  });

  it('renders default avatar when user avatarUrl is null', () => {
    const fakeReview = makeFakeReview({
      user: {
        name: 'Петр Петров',
        avatarUrl: null,
      },
    });

    render(<ReviewCard review={fakeReview} />);

    const avatarImage = screen.getByTestId('avatar-image');
    expect(avatarImage).toHaveAttribute('src', 'img/content/review-1.jpg');
  });

  it('does not render text blocks when positive and negative fields are empty', () => {
    const fakeReview = makeFakeReview({
      positive: '',
      negative: '',
    });

    render(<ReviewCard review={fakeReview} />);

    expect(screen.queryAllByTestId('review-text')).toHaveLength(0);
  });
});
