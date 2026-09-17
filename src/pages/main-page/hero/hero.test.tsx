import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import Hero from './hero';
import { AppRoute } from '../../../const/infrastructure';
import { isLocationState } from '../../../utils/guards/router';
import { withHistory } from '../../../utils/testing/mock-components';

const LocationState = () => {
  const location = useLocation();

  if (!isLocationState(location.state) || !location.state.from) {
    return null;
  }

  return (
    <div data-testid="location-state">
      <span data-testid="pathname">{location.state.from.pathname}</span>
      <span data-testid="search">{location.state.from.search}</span>
      <span data-testid="hash">{location.state.from.hash}</span>
    </div>
  );
};

describe('Component: Hero', () => {
  it('should render hero content and image', () => {
    render(withHistory(<Hero />));

    expect(screen.getByText('Твоя пушистая кондитерская')).toBeInTheDocument();

    expect(screen.getByText('КЕКС')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: 'Картинка кота.' })).toHaveAttribute(
      'src',
      'img/svg/hero-keks.svg',
    );
  });

  it('should render link to catalog', () => {
    render(withHistory(<Hero />));

    expect(
      screen.getByRole('link', { name: 'Скорее смотреть' }),
    ).toHaveAttribute('href', AppRoute.Catalog);
  });

  it('should pass current location in state when navigating to catalog', async () => {
    const user = userEvent.setup();

    render(
      withHistory(
        <>
          <Hero />

          <Routes>
            <Route path={AppRoute.Catalog} element={<LocationState />} />
          </Routes>
        </>,
        ['/favorites?test=value#section'],
      ),
    );

    await user.click(screen.getByRole('link', { name: 'Скорее смотреть' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/favorites');
    expect(screen.getByTestId('search')).toHaveTextContent('?test=value');
    expect(screen.getByTestId('hash')).toHaveTextContent('#section');
  });
});
