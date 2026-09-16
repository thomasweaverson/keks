import type { Location } from 'react-router-dom';

import type { TLocationState, TRouteHandle } from '../../types/infrastructure';

const isLocation = (
  value: unknown,
): value is Pick<Location, 'pathname' | 'search' | 'hash'> =>
  typeof value === 'object' &&
  value !== null &&
  'pathname' in value &&
  typeof value.pathname === 'string' &&
  'search' in value &&
  typeof value.search === 'string' &&
  'hash' in value &&
  typeof value.hash === 'string';

export const isLocationState = (state: unknown): state is TLocationState => {
  if (typeof state !== 'object' || state === null) {
    return false;
  }

  if (!('from' in state)) {
    return true;
  }

  return state.from === undefined || isLocation(state.from);
};

export const isRouteHandle = (value: unknown): value is TRouteHandle => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if ('hideHeader' in value) {
    const { hideHeader } = value;

    if (hideHeader !== undefined && typeof hideHeader !== 'boolean') {
      return false;
    }
  }

  if ('hideFooter' in value) {
    const { hideFooter } = value;

    if (hideFooter !== undefined && typeof hideFooter !== 'boolean') {
      return false;
    }
  }

  return true;
};
