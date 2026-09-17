import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RegistrationPage from './registration-page';
import { AppRoute } from '../../const/infrastructure';
import { withHistory } from '../../utils/testing/mock-components';

vi.mock('./registration-form/registration-form', () => ({
  default: () => <div data-testid="registration-form" />,
}));

describe('Component: RegistrationPage', () => {
  it('should render registration page content', () => {
    render(withHistory(<RegistrationPage />));

    expect(
      screen.getByRole('heading', { name: 'Регистрация' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Уже зарегистрированы?', { exact: false }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('в свой аккаунт.', { exact: false }),
    ).toBeInTheDocument();
  });

  it('should render registration form', () => {
    render(withHistory(<RegistrationPage />));

    expect(
      screen.getByTestId('registration-form'),
    ).toBeInTheDocument();
  });

  it('should render hero image with correct attributes', () => {
    render(withHistory(<RegistrationPage />));

    const image = screen.getByRole('img', {
      name: 'Картинка кота.',
    });

    expect(image).toHaveAttribute('src', 'img/svg/hero-keks.svg');
    expect(image).toHaveAttribute('width', '727');
    expect(image).toHaveAttribute('height', '569');
  });

  it('should render link to login page', () => {
    render(withHistory(<RegistrationPage />));

    expect(
      screen.getByRole('link', { name: 'Войдите' }),
    ).toHaveAttribute('href', AppRoute.Login);
  });

  it('should set page title', () => {
    render(withHistory(<RegistrationPage />));

    expect(document.title).toBe(
      'Кондитерская Кекс - Регистрация',
    );
  });
});
