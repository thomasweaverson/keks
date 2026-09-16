import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BackLink from './back-link';
import { AppRoute } from '../../const/infrastructure';
import { withHistory } from '../../utils/testing/mock-components';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BackLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows link to main page when previous route is unavailable', () => {
    render(withHistory(<BackLink />));

    const link = screen.getByRole('link', { name: /на главную/i });

    expect(link).toHaveAttribute('href', AppRoute.Root);
    expect(
      screen.queryByRole('link', { name: /назад/i }),
    ).not.toBeInTheDocument();
  });

  it('shows back link when previous route is available', () => {
    render(
      withHistory(<BackLink />, [
        {
          pathname: AppRoute.Catalog,
          search: '',
          hash: '',
          state: {
            from: {
              pathname: AppRoute.Root,
              search: '',
              hash: '',
            },
          },
        },
      ]),
    );

    expect(
      screen.getByRole('link', { name: /назад/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: /на главную/i }),
    ).not.toBeInTheDocument();
  });

  it('navigates back when back link is clicked', async () => {
    const user = userEvent.setup();

    render(
      withHistory(<BackLink />, [
        AppRoute.Root,
        {
          pathname: AppRoute.Catalog,
          search: '',
          hash: '',
          state: {
            from: {
              pathname: AppRoute.Root,
              search: '',
              hash: '',
            },
          },
        },
      ]),
    );

    await user.click(screen.getByRole('link', { name: /назад/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
