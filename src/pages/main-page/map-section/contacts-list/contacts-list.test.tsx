import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactsList from './contacts-list';
import { Locations } from '../../../../const/contacts';

describe('Component: ContactsList', () => {
  it('should render all locations', () => {
    render(
      <ContactsList
        activeLocation={Locations.Confectionery1}
        onLocationChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('radio', { name: Locations.Confectionery1.name }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: Locations.Confectionery2.name }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: Locations.Manufacture.name }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(Locations.Confectionery1.address),
    ).toBeInTheDocument();

    expect(
      screen.getByText(Locations.Confectionery2.address),
    ).toBeInTheDocument();

    expect(
      screen.getByText(Locations.Manufacture.address),
    ).toBeInTheDocument();
  });

  it('should mark active location as checked', () => {
    render(
      <ContactsList
        activeLocation={Locations.Confectionery2}
        onLocationChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('radio', { name: Locations.Confectionery2.name }),
    ).toBeChecked();

    expect(
      screen.getByRole('radio', { name: Locations.Confectionery1.name }),
    ).not.toBeChecked();

    expect(
      screen.getByRole('radio', { name: Locations.Manufacture.name }),
    ).not.toBeChecked();
  });

  it('should call onLocationChange with selected location', async () => {
    const user = userEvent.setup();
    const onLocationChange = vi.fn();

    render(
      <ContactsList
        activeLocation={Locations.Confectionery1}
        onLocationChange={onLocationChange}
      />,
    );

    await user.click(
      screen.getByRole('radio', { name: Locations.Manufacture.name }),
    );

    expect(onLocationChange).toHaveBeenCalledOnce();
    expect(onLocationChange).toHaveBeenCalledWith(Locations.Manufacture);
  });
});
