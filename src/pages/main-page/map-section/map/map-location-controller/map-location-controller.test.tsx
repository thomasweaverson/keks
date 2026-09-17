import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useMap } from 'react-leaflet';
import MapLocationController from './map-location-controller';
import { Locations } from '../../../../../const/contacts';

vi.mock('react-leaflet', () => ({
  useMap: vi.fn(),
}));

describe('Component: MapLocationController', () => {
  it('should fly to the selected location on mount', () => {
    const flyTo = vi.fn();
    const getZoom = vi.fn().mockReturnValue(13);

    vi.mocked(useMap).mockReturnValue({
      flyTo,
      getZoom,
    } as unknown as ReturnType<typeof useMap>);

    render(
      <MapLocationController location={Locations.Confectionery1} />,
    );

    expect(getZoom).toHaveBeenCalledOnce();
    expect(flyTo).toHaveBeenCalledOnce();
    expect(flyTo).toHaveBeenCalledWith(
      [
        Locations.Confectionery1.coordinates.latitude,
        Locations.Confectionery1.coordinates.longitude,
      ],
      13,
      {
        duration: 0.5,
      },
    );
  });

  it('should fly to the new location when location changes', () => {
    const flyTo = vi.fn();
    const getZoom = vi.fn().mockReturnValue(13);

    vi.mocked(useMap).mockReturnValue({
      flyTo,
      getZoom,
    } as unknown as ReturnType<typeof useMap>);

    const { rerender } = render(
      <MapLocationController location={Locations.Confectionery1} />,
    );

    flyTo.mockClear();
    getZoom.mockClear();

    rerender(
      <MapLocationController location={Locations.Manufacture} />,
    );

    expect(getZoom).toHaveBeenCalledOnce();
    expect(flyTo).toHaveBeenCalledOnce();
    expect(flyTo).toHaveBeenCalledWith(
      [
        Locations.Manufacture.coordinates.latitude,
        Locations.Manufacture.coordinates.longitude,
      ],
      13,
      {
        duration: 0.5,
      },
    );
  });
});
