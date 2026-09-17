import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import LoginPage from './login-page';
import { AppRoute } from '../../const/infrastructure';
import { withHistory } from '../../utils/testing/mock-components';

vi.mock('./login-form/login-form', () => ({
  default: () => <div data-testid="login-form" />,
}));

describe('Component: LoginPage', () => {
  it('should render page title', () => {
    render(withHistory(<LoginPage />));

    expect(
      screen.getByRole('heading', { name: 'Вход' }),
    ).toBeInTheDocument();
  });

  it('should render hero image', () => {
    render(withHistory(<LoginPage />));

    expect(
      screen.getByRole('img', { name: 'Картинка кота.' }),
    ).toBeInTheDocument();
  });

  it('should render login form', () => {
    render(withHistory(<LoginPage />));

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should render registration link', () => {
    render(withHistory(<LoginPage />));

    const registrationLink = screen.getByRole('link', {
      name: 'Создайте',
    });

    expect(registrationLink).toBeInTheDocument();
    expect(registrationLink).toHaveAttribute(
      'href',
      AppRoute.Registration,
    );
  });

  it('should set document title', () => {
    render(withHistory(<LoginPage />));

    expect(document.title).toBe('Кондитерская Кекс - Вход');
  });
});
