import { NameSpace } from '../../../const/infrastructure';
import type {
  TAuthorizationStatus,
  TRegistrationStatus,
} from '../../../types/infrastructure';
import type { TState } from '../../../types/state';
import type { TUserInfo } from '../../../types/user';

export const getAuthorizationStatus = (
  state: Pick<TState, typeof NameSpace.User>,
): TAuthorizationStatus => state[NameSpace.User].authorizationStatus;

export const getRegistrationStatus = (
  state: Pick<TState, typeof NameSpace.User>,
): TRegistrationStatus => state[NameSpace.User].registrationStatus;

export const getUserInfo = (
  state: Pick<TState, typeof NameSpace.User>,
): TUserInfo | null => state[NameSpace.User].userInfo;
