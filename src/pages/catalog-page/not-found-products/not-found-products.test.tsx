import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFoundProducts from './not-found-products';

describe('Component: NotFoundProducts', () => {
  it('should render not found message', () => {
    render(<NotFoundProducts />);

    expect(
      screen.getByText('Все выбранные кексы съели.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Мы уже печём новые.'),
    ).toBeInTheDocument();
  });

  it('should render cat image with accessible name', () => {
    render(<NotFoundProducts />);

    expect(
      screen.getByRole('img', { name: 'Картинка кота.' }),
    ).toBeInTheDocument();
  });
});
