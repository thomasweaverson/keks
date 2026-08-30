import { Locations } from "../../../const/contacts";
import type { TLocation } from "../../../types/business";

type TContactsListProps = {
  activeLocation: TLocation;
  onLocationChange: (location: TLocation) => void;
};

const locations = Object.values(Locations);

const ContactsList = ({
  activeLocation,
  onLocationChange,
}: TContactsListProps) => {
  const handleChange = (location: TLocation) => {
    onLocationChange(location);
  };

  return (
    <ul className="map__addresses">
      {locations.map((location) => {
        const id = `location-${location.name}`;

        return (
          <li className="map__address" key={location.name}>
            <div className="custom-toggle custom-toggle--radio custom-toggle--address">
              <input
                className="visually-hidden"
                type="radio"
                id={id}
                name="location"
                checked={location === activeLocation}
                onChange={() => handleChange(location)}
              />

              <label className="custom-toggle__label" htmlFor={id}>
                {location.name}
              </label>

              <address className="custom-toggle__address">
                {location.address}

                <svg
                  className="custom-toggle__icon"
                  width="26"
                  height="24"
                  aria-hidden="true"
                >
                  <use
                    href={`#icon-keks-footprint${location.name === Locations.Manufacture.name ? "-production" : ""}`}
                  />
                </svg>
              </address>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ContactsList;
