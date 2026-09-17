import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NoReviews from './no-reviews';

describe('Component: NoReviews', () => {
  it('should render empty reviews message and cake icon', () => {
    const { container } = render(<NoReviews />);

    expect(
      screen.getByRole('heading', { level: 2 }),
    ).toHaveTextContent(
      'Про этот кекс нам ничего не рассказали. Вы можете оставить свой отзыв первым.',
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('svg use')).toHaveAttribute(
      'href',
      '#icon-cake',
    );
  });
});
