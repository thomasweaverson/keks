import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { TLocation } from '../../../../../types/business';

type TMapLocationControllerProps = {
  location: TLocation;
};

const MapLocationController = ({
  location,
}: TMapLocationControllerProps): null => {
  const map = useMap();

  const { latitude, longitude } = location.coordinates;

  useEffect(() => {
    map.flyTo([latitude, longitude], map.getZoom(), {
      duration: 0.5,
    });
  }, [latitude, longitude, map]);

  return null;
};

export default MapLocationController;
