import { render, screen } from '@testing-library/react';

import { AppRoute } from '../../../../const/infrastructure';
import { describe, expect, it } from 'vitest';
import { withHistory } from '../../../../utils/testing/mock-components';
import HeaderLogo from './header-logo';

describe('Component: HeaderLogo', () => {
  it('renders logo without link on main page', () => {
    render(withHistory(<HeaderLogo />, [AppRoute.Root]));

    expect(screen.getByTestId('logo-image')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders logo as a link to main page on other pages', () => {
    render(withHistory(<HeaderLogo />, [AppRoute.Catalog]));

    const logo = screen.getByRole('link', {
      name: 'Переход на главную',
    });

    expect(logo).toHaveAttribute('href', AppRoute.Root);
    expect(
      screen.getByRole('img', { name: 'Кондитерская кекс' }),
    ).toBeInTheDocument();
  });
});
