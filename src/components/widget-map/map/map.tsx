import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./map.module.css";
import L from "leaflet";

import type { TLocation } from "../../../types/business";
import MapController from "./map-controller";

type TMapProps = {
  location: TLocation;
};

const Map = ({ location }: TMapProps) => {
  const { latitude, longitude } = location.coordinates;

  const icon = L.icon({
    iconUrl: location.icon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <MapContainer
      className="map__wrapper"
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController location={location} />

      <Marker position={[latitude, longitude]} icon={icon} />
    </MapContainer>
  );
};

export default Map;
