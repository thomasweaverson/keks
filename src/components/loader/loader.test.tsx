import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loader from './loader';

describe('Simple test for simple component Loader', () => {
  it('render container with class .loader', () => {
    render(<Loader />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toHaveClass('loader');
  });
});
