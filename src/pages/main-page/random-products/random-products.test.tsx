import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';

import RandomProducts from './random-products';
import { AppRoute, LoadingStatus } from '../../../const/infrastructure';
import { isLocationState } from '../../../utils/guards/router';
import { withHistory, withStore } from '../../../utils/testing/mock-components';
import {
  makeFakeRandomPack,
} from '../../../utils/testing/mocks';

vi.mock('../../../components/card/card', () => ({
  default: () => <div data-testid="product-card" />,
}));

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

describe('Component: RandomProducts', () => {
  it('should render nothing when random products are absent', () => {
    const { withStoreComponent } = withStore(<RandomProducts />);

    render(withHistory(withStoreComponent));

    expect(
      screen.queryByRole('heading', { name: 'кексы' }),
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: 'Все кексы' }),
    ).not.toBeInTheDocument();
  });

  it('should render random products and catalog link', () => {
    const randomProducts = makeFakeRandomPack();

    const { withStoreComponent } = withStore(<RandomProducts />, {
      Products: {
        products: [],
        productsLoadingStatus: LoadingStatus.Idle,
        randomPack: randomProducts,
      },
    });

    render(withHistory(withStoreComponent));

    expect(screen.getByRole('heading', { name: 'кексы' })).toBeInTheDocument();

    expect(screen.getAllByTestId('product-card')).toHaveLength(
      randomProducts.length,
    );

    expect(screen.getByRole('link', { name: 'Все кексы' })).toHaveAttribute(
      'href',
      AppRoute.Catalog,
    );
  });

  it('should pass current location to catalog link as from state', async () => {
    const user = userEvent.setup();
    const randomProducts = makeFakeRandomPack();

    const { withStoreComponent } = withStore(<RandomProducts />, {
      Products: {
        products: [],
        productsLoadingStatus: LoadingStatus.Idle,
        randomPack: randomProducts,
      },
    });

    render(
      withHistory(
        <>
          {withStoreComponent}
          <LocationState />
        </>,
        ['/favorites?foo=bar#reviews'],
      ),
    );

    await user.click(screen.getByRole('link', { name: 'Все кексы' }));

    expect(screen.getByTestId('location-state')).toBeInTheDocument();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/favorites');
    expect(screen.getByTestId('search')).toHaveTextContent('?foo=bar');
    expect(screen.getByTestId('hash')).toHaveTextContent('#reviews');
  });
});
