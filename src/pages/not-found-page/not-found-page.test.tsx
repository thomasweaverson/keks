import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFoundPage from './not-found-page';
import { AppRoute } from '../../const/infrastructure';
import { withHistory } from '../../utils/testing/mock-components';

describe('Component: NotFoundPage', () => {
  it('should render not found page content', () => {
    render(withHistory(<NotFoundPage />));

    expect(
      screen.getByRole('heading', { name: '404', level: 1 }),
    ).toBeInTheDocument();

    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();

    expect(screen.getByText(/Она была удалена/)).toBeInTheDocument();

    expect(
      screen.getByText(/вы указали неправильный адрес/),
    ).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    render(withHistory(<NotFoundPage />));

    const homeLink = screen.getByRole('link', {
      name: /Вернуться\s+на\s+главную/,
    });

    expect(homeLink).toHaveAttribute('href', AppRoute.Root);
  });

  it('should set page title', () => {
    render(withHistory(<NotFoundPage />));

    expect(document.title).toBe('Кондитерская Кекс - 404');
  });
});
