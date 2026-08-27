import type {
  AuthorizationStatus,
  RegistrationStatus,
} from "../const/infrastructure";

export type TAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

export type TRegistrationStatus =
  (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export type TRouteHandle = {
    hideHeader?: boolean;
    hideFooter?: boolean;
  };
