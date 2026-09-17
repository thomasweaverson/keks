import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ShowMoreCommentsButton from './show-more-comments-button';

describe('Component: ShowMoreCommentsButton', () => {
  it('should render show more button', () => {
    render(<ShowMoreCommentsButton onClick={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Показать еще' }),
    ).toBeInTheDocument();
  });

  it('should call onClick when show more button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ShowMoreCommentsButton onClick={handleClick} />);

    await user.click(
      screen.getByRole('button', { name: 'Показать еще' }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
