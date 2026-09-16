import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import StarRating from './star-rating';
import { RATING_STARS_COUNT } from '../../const/business';

describe('Component: StarRating', () => {
  it('renders correctly with rounded rating and aria-label', () => {
    const rating = 3.6; // Округляется до 4
    const expectedRating = 4;

    const { container } = render(<StarRating rating={rating} />);

    const ratingElement = screen.getByLabelText(
      `Рейтинг ${expectedRating} из ${RATING_STARS_COUNT}`,
    );
    expect(ratingElement).toBeInTheDocument();

    const activeStars = container.querySelectorAll('.star-rating__star--active');
    expect(activeStars).toHaveLength(expectedRating);

    const totalStars = container.querySelectorAll('.star-rating__star');
    expect(totalStars).toHaveLength(RATING_STARS_COUNT);
  });

  it('clamps negative rating to zero', () => {
    const { container } = render(<StarRating rating={-2} />);

    expect(
      screen.getByLabelText(`Рейтинг 0 из ${RATING_STARS_COUNT}`),
    ).toBeInTheDocument();

    const activeStars = container.querySelectorAll('.star-rating__star--active');
    expect(activeStars).toHaveLength(0);
  });

  it('clamps rating that exceeds max stars count', () => {
    const overflowRating = RATING_STARS_COUNT + 5;

    const { container } = render(<StarRating rating={overflowRating} />);

    expect(
      screen.getByLabelText(
        `Рейтинг ${RATING_STARS_COUNT} из ${RATING_STARS_COUNT}`,
      ),
    ).toBeInTheDocument();

    const activeStars = container.querySelectorAll('.star-rating__star--active');
    expect(activeStars).toHaveLength(RATING_STARS_COUNT);
  });

  it('renders review count when provided', () => {
    const reviewCount = 42;

    render(<StarRating rating={4} reviewCount={reviewCount} />);

    expect(screen.getByText(reviewCount.toString())).toBeInTheDocument();
  });

  it('does not render review count when omitted', () => {
    const reviewCount = 42;

    render(<StarRating rating={4} />);

    expect(screen.queryByText(reviewCount.toString())).not.toBeInTheDocument();
  });
});
