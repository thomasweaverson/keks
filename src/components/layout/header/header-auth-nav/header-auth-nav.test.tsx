import { render, screen } from '@testing-library/react';

import { AppRoute } from '../../../../const/infrastructure';
import HeaderAuthNav from './header-auth-nav';
import { withHistory } from '../../../../utils/testing/mock-components';
import { describe, expect, it } from 'vitest';

describe('Component: HeaderAuthNav', () => {
  it('renders registration and login links', () => {
    render(withHistory(<HeaderAuthNav />));

    expect(
      screen.getByRole('link', { name: 'Регистрация' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Войти' })).toBeInTheDocument();
  });

  it('links to registration and login routes', () => {
    render(withHistory(<HeaderAuthNav />));

    expect(screen.getByRole('link', { name: 'Регистрация' })).toHaveAttribute(
      'href',
      AppRoute.Registration,
    );
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute(
      'href',
      AppRoute.Login,
    );
  });
});
