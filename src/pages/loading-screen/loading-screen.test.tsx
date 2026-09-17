import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoadingScreen from './loading-screen';

vi.mock('../../components/loader/loader', () => ({
  default: () => <div data-testid="loader">Загрузка</div>,
}));

describe('Component: LoadingScreen', () => {
  it('should render loader', () => {
    render(<LoadingScreen />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
