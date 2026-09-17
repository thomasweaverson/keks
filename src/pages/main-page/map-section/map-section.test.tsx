import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MapSection from './map-section';
import { Locations } from '../../../const/contacts';

vi.mock('./map/map', () => ({
  default: vi.fn(({ location }: { location: typeof Locations.Confectionery1 }) => (
    <div data-testid="map">{location.name}</div>
  )),
}));

describe('Component: MapSection', () => {
  it('should render the default active location', () => {
    render(<MapSection />);

    expect(
      screen.getByRole('radio', { name: Locations.Confectionery1.name }),
    ).toBeChecked();

    expect(screen.getByTestId('map')).toHaveTextContent(
      Locations.Confectionery1.name,
    );
  });

  it('should change active location when user selects another location', async () => {
    const user = userEvent.setup();

    render(<MapSection />);

    await user.click(
      screen.getByRole('radio', { name: Locations.Manufacture.name }),
    );

    expect(
      screen.getByRole('radio', { name: Locations.Manufacture.name }),
    ).toBeChecked();

    expect(
      screen.getByRole('radio', { name: Locations.Confectionery1.name }),
    ).not.toBeChecked();

    expect(screen.getByTestId('map')).toHaveTextContent(
      Locations.Manufacture.name,
    );
  });
});
