import {
  AuthorizationStatus,
  RegistrationStatus,
} from '../../../const/infrastructure';
import { makeFakeUserInfo } from '../../../utils/testing/mocks';
import type { TUserState } from '../../../types/state';
import {
  getAuthorizationStatus,
  getRegistrationStatus,
  getUserInfo,
} from './user.selectors';
import { describe, expect, it } from 'vitest';

describe('User selectors', () => {
  const userState: TUserState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    registrationStatus: RegistrationStatus.Idle,
    userInfo: null,
    isAvatarLoadingError: false,
  };

  it('returns authorization status', () => {
    const state: TUserState = {
      ...userState,
      authorizationStatus: AuthorizationStatus.Auth,
    };

    expect(getAuthorizationStatus({ User: state })).toBe(
      AuthorizationStatus.Auth,
    );
  });

  it('returns registration status', () => {
    const state: TUserState = {
      ...userState,
      registrationStatus: RegistrationStatus.Success,
    };

    expect(getRegistrationStatus({ User: state })).toBe(
      RegistrationStatus.Success,
    );
  });

  it('returns user info', () => {
    const userInfo = makeFakeUserInfo();
    const state: TUserState = {
      ...userState,
      userInfo,
    };

    expect(getUserInfo({ User: state })).toBe(userInfo);
  });

  it('returns null when user is not authorized', () => {
    expect(getUserInfo({ User: userState })).toBeNull();
  });
});
