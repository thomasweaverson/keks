import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import ErrorPage from './error-page';

describe('Component: ErrorPage', () => {
  it('should render error page content', () => {
    render(
      <HelmetProvider>
        <ErrorPage />
      </HelmetProvider>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Ошибка загрузки страницы',
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Что-то пошло не так...',
    );

    expect(
      screen.getByText(/Попробуйте перезагрузить страницу/),
    ).toBeInTheDocument();
  });

  it('should render error image', () => {
    render(
      <HelmetProvider>
        <ErrorPage />
      </HelmetProvider>,
    );

    expect(screen.getByRole('img', { name: 'Кекс.' })).toHaveAttribute(
      'src',
      'img/svg/cake-load.svg',
    );
  });

  it('should set page title', () => {
    render(
      <HelmetProvider>
        <ErrorPage />
      </HelmetProvider>,
    );

    expect(document.title).toBe('Кондитерская Кекс - Ошибка загрузки страницы');
  });
});
