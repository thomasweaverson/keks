import { useState } from "react";
import { Locations } from "../../const/contacts";
import type { TLocation } from "../../types/business";
import ContactsList from "./contacts-list/contacts-list";
import Map from "./map/map";

const WidgetMap = () => {
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

export default WidgetMap;
