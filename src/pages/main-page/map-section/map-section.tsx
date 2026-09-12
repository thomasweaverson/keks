import { useState } from 'react';
import ContactsList from './contacts-list/contacts-list';
import Map from './map/map';
import type { TLocation } from '../../../types/business';
import { Locations } from '../../../const/contacts';

const MapSection = () => {
  const [activeLocation, setActiveLocation] = useState<TLocation>(
    Locations.Confectionery1,
  );

  return (
    <section className="map">
      <div className="container">
        <h2 className="map__title">адреса</h2>

        <Map location={activeLocation} />

        <ContactsList
          activeLocation={activeLocation}
          onLocationChange={setActiveLocation}
        />
      </div>
    </section>
  );
};

export default MapSection;
