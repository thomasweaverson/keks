import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Summary from './summary';
import { AppRoute } from '../../../const/infrastructure';
import userEvent from '@testing-library/user-event';

const LocationState = () => {
  const location = useLocation();

  return <output role="status">{JSON.stringify(location.state)}</output>;
};

const renderSummary = (
  favoritesCount: number,
  totalPrice: number,
  initialEntry = '/favorites',
) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Summary favoritesCount={favoritesCount} totalPrice={totalPrice} />
      <LocationState />
    </MemoryRouter>,
  );

describe('Component: Summary', () => {
  it('should render favorites count with correct plural form', () => {
    renderSummary(5, 1000);

    expect(screen.getByText('5 кексов', { exact: true })).toBeInTheDocument();
  });

  it('should render total price in formatted form', () => {
    renderSummary(3, 1234567);

    expect(
      screen.getByText('1 234 567 р', { exact: true }),
    ).toBeInTheDocument();
  });

  it('should render link to catalog', () => {
    renderSummary(1, 500);

    const link = screen.getByRole('link', { name: 'В каталог' });

    expect(link).toHaveAttribute('href', AppRoute.Catalog);
  });

  it('should pass current location to catalog link as "from" state', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Summary favoritesCount={1} totalPrice={500} />
        <LocationState />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: 'В каталог' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      JSON.stringify({
        from: {
          pathname: '/favorites',
          search: '',
          hash: '',
        },
      }),
    );
  });
});
