import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import RatingInput from './rating-input';
import { MAX_RATING, MIN_RATING } from '../const';

describe('Component: RatingInput', () => {
  it('should render all rating options', () => {
    render(<RatingInput value={0} onChange={vi.fn()} />);

    const ratings = screen.getAllByRole('radio');

    expect(ratings).toHaveLength(MAX_RATING);

    ratings.forEach((rating, index) => {
      expect(rating).toHaveAttribute(
        'value',
        String(MAX_RATING - index),
      );
    });
  });

  it('should mark the current rating as checked', () => {
    const currentRating = 4;

    render(<RatingInput value={currentRating} onChange={vi.fn()} />);

    const selectedRating = screen.getByRole('radio', {
      name: `${currentRating} звезды`,
    });

    expect(selectedRating).toBeChecked();
  });

  it('should not mark any rating as checked when value is 0', () => {
    render(<RatingInput value={0} onChange={vi.fn()} />);

    const ratings = screen.getAllByRole('radio');

    ratings.forEach((rating) => {
      expect(rating).not.toBeChecked();
    });
  });

  it('should call onChange with selected rating', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RatingInput value={0} onChange={onChange} />);

    await user.click(
      screen.getByRole('radio', {
        name: '3 звезды',
      }),
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('should use singular form for minimum rating', () => {
    render(<RatingInput value={MIN_RATING} onChange={vi.fn()} />);

    expect(
      screen.getByRole('radio', {
        name: `${MIN_RATING} звезда`,
      }),
    ).toBeInTheDocument();
  });
});
