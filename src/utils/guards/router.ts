import type { Location } from 'react-router-dom';

import type { TLocationState } from '../../types/infrastructure';

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

export const isLocationState = (
  state: unknown,
): state is TLocationState =>
  typeof state === 'object' &&
  state !== null &&
  'from' in state &&
  isLocation(state.from);
