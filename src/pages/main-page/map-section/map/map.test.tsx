import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Map from './map';
import { Locations } from '../../../../const/contacts';

type TIconOptions = {
  iconUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
};

vi.mock('react-leaflet', () => ({
  MapContainer: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="map-container" className={className}>
      {children}
    </div>
  ),

  TileLayer: ({
    attribution,
    url,
  }: {
    attribution: string;
    url: string;
  }) => (
    <div
      data-testid="tile-layer"
      data-attribution={attribution}
      data-url={url}
    />
  ),

  Marker: ({
    position,
    icon,
  }: {
    position: [number, number];
    icon: {
      iconUrl: string;
      iconSize: [number, number];
      iconAnchor: [number, number];
    };
  }) => (
    <div
      data-testid="marker"
      data-position={JSON.stringify(position)}
      data-icon-url={icon.iconUrl}
      data-icon-size={JSON.stringify(icon.iconSize)}
      data-icon-anchor={JSON.stringify(icon.iconAnchor)}
    />
  ),
}));

vi.mock('leaflet', () => ({
  default: {
    icon: (options: TIconOptions) => options,
  },
}));

vi.mock(
  './map-location-controller/map-location-controller',
  () => ({
    default: ({ location }: { location: typeof Locations.Confectionery1 }) => (
      <div
        data-testid="map-location-controller"
        data-location-id={location.id}
      />
    ),
  }),
);

describe('Component: Map', () => {
  it('should render map with selected location', () => {
    render(<Map location={Locations.Confectionery1} />);

    expect(screen.getByTestId('map-container')).toHaveClass('map__wrapper');
    expect(screen.getByTestId('map-location-controller')).toHaveAttribute(
      'data-location-id',
      Locations.Confectionery1.id,
    );
  });

  it('should configure tile layer', () => {
    render(<Map location={Locations.Confectionery1} />);

    const tileLayer = screen.getByTestId('tile-layer');

    expect(tileLayer).toHaveAttribute(
      'data-attribution',
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    );
    expect(tileLayer).toHaveAttribute(
      'data-url',
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
  });

  it('should configure marker with selected location', () => {
    render(<Map location={Locations.Manufacture} />);

    const marker = screen.getByTestId('marker');

    expect(marker).toHaveAttribute(
      'data-position',
      JSON.stringify([
        Locations.Manufacture.coordinates.latitude,
        Locations.Manufacture.coordinates.longitude,
      ]),
    );

    expect(marker).toHaveAttribute(
      'data-icon-url',
      Locations.Manufacture.icon,
    );

    expect(marker).toHaveAttribute(
      'data-icon-size',
      JSON.stringify([40, 40]),
    );

    expect(marker).toHaveAttribute(
      'data-icon-anchor',
      JSON.stringify([20, 40]),
    );
  });

  it('should update map, marker and controller when location changes', () => {
    const { rerender } = render(
      <Map location={Locations.Confectionery1} />,
    );

    rerender(<Map location={Locations.Confectionery2} />);

    expect(screen.getByTestId('map-location-controller')).toHaveAttribute(
      'data-location-id',
      Locations.Confectionery2.id,
    );

    expect(screen.getByTestId('marker')).toHaveAttribute(
      'data-position',
      JSON.stringify([
        Locations.Confectionery2.coordinates.latitude,
        Locations.Confectionery2.coordinates.longitude,
      ]),
    );

    expect(screen.getByTestId('marker')).toHaveAttribute(
      'data-icon-url',
      Locations.Confectionery2.icon,
    );
  });
});
