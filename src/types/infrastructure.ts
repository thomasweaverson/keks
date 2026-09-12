import type { Location } from 'react-router-dom';
import type {
  AuthorizationStatus,
  LoadingStatus,
  RegistrationStatus,
} from '../const/infrastructure';

export type TAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

export type TRegistrationStatus =
  (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export type TRouteHandle = {
  hideHeader?: boolean;
  hideFooter?: boolean;
};

export type TLoadingStatus = (typeof LoadingStatus)[keyof typeof LoadingStatus];

export type TLocationState = {
  from?: Pick<Location, 'pathname' | 'search' | 'hash'>;
};
