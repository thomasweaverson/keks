import { render, screen } from '@testing-library/react';

import Footer from './footer';
import { describe, expect, it } from 'vitest';

describe('Component: Footer', () => {
  it('renders feedback email link', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: 'pecarnya@academy.pro' }),
    ).toHaveAttribute('href', 'mailto:pecarnya@academy.pro');
  });

  it('renders social links', () => {
    render(<Footer />);

    const socialLinks = [
      screen.getByRole('link', { name: 'Вконтакте' }),
      screen.getByRole('link', { name: 'Телеграм' }),
    ];

    for (const link of socialLinks) {
      expect(link).toHaveAttribute('href', '#');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'nofollow noopener');
    }
  });

  it('renders developers link', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: 'Разработано .html Academy' }),
    ).toHaveAttribute('href', 'https://htmlacademy.ru/');
  });
});
