import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import Layout from './layout';

vi.mock('./header/header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('./footer/footer', () => ({
  default: () => <div data-testid="footer" />,
}));

const renderLayoutWithDataRouter = (
  handleConfig?: { hideHeader?: boolean; hideFooter?: boolean },
) => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <div data-testid="outlet-content">Outlet Content</div>,
          handle: handleConfig,
        },
      ],
    },
  ]);

  return render(<RouterProvider router={router} />);
};

describe('Component: Layout', () => {
  it('renders Header, Footer, and Outlet content by default', () => {
    renderLayoutWithDataRouter();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('hides Header when handle.hideHeader is true', () => {
    renderLayoutWithDataRouter({ hideHeader: true });

    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('hides Footer when handle.hideFooter is true', () => {
    renderLayoutWithDataRouter({ hideFooter: true });

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });
});
