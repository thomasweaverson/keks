import { Locations } from '../../../../const/contacts';
import type { TLocation } from '../../../../types/business';

type TContactsListProps = {
  activeLocation: TLocation;
  onLocationChange: (location: TLocation) => void;
};

const locations = Object.values(Locations);

const ContactsList = ({
  activeLocation,
  onLocationChange,
}: TContactsListProps) => (
  <ul className="map__addresses">
    {locations.map((location) => (
      <li className="map__address" key={location.id}>
        <div className="custom-toggle custom-toggle--radio custom-toggle--address">
          <input
            className="visually-hidden"
            type="radio"
            id={location.id}
            name="location"
            checked={location.id === activeLocation.id}
            onChange={() => onLocationChange(location)}
          />

          <label className="custom-toggle__label" htmlFor={location.id}>
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
                href={`#icon-keks-footprint${location.name === Locations.Manufacture.name ? '-production' : ''}`}
              />
            </svg>
          </address>
        </div>
      </li>
    ))}
  </ul>
);

export default ContactsList;
