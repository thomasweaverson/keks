import type { AuthorizationStatus, RegistrationStatus } from "../const/infrastructure";

export type TAuthStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

  export type TRegistrationStatus =
  (typeof RegistrationStatus)[keyof typeof RegistrationStatus];
