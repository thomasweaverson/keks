import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import EmptyFavorites from './empty-favorites';

const LocationState = () => {
  const location = useLocation();

  return <output role="status">{JSON.stringify(location.state)}</output>;
};

describe('Component: EmptyFavorites', () => {
  it('should render empty favorites content', () => {
    render(
      <MemoryRouter>
        <EmptyFavorites />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Избранные товары' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Кажется, пока вы не добавили ни одного кекса'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'Картинка кота.' }),
    ).toBeInTheDocument();
  });

  it('should contain link to catalog', () => {
    render(
      <MemoryRouter>
        <EmptyFavorites />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'К кексам' })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it('should pass current location to catalog link as "from" state', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <EmptyFavorites />
        <LocationState />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: 'К кексам' }));

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
