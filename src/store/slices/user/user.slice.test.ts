import {
  AuthorizationStatus,
  RegistrationStatus,
} from '../../../const/infrastructure';
import { makeFakeUserInfo } from '../../../utils/testing/mocks';
import type { TUserState } from '../../../types/state';
import {
  authorizeUserAction,
  checkAuthAction,
  logoutAction,
  registerUserAction,
} from '../../api-actions';
import { userSlice } from './user.slice';
import { describe, expect, it } from 'vitest';

describe('User slice', () => {
  const initialState: TUserState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    registrationStatus: RegistrationStatus.Idle,
    userInfo: null,
    isAvatarLoadingError: false,
  };

  it('returns initial state without additional action', () => {
    expect(userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState,
    );
  });

  describe('checkAuthAction', () => {
    it('sets auth status and user info on fulfilled', () => {
      const userInfo = makeFakeUserInfo();

      const state = userSlice.reducer(
        initialState,
        checkAuthAction.fulfilled(userInfo, 'request-id', undefined),
      );

      expect(state.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(state.userInfo).toBe(userInfo);
    });

    it('sets no auth status and clears user info on rejected', () => {
      const currentState: TUserState = {
        ...initialState,
        authorizationStatus: AuthorizationStatus.Auth,
        userInfo: makeFakeUserInfo(),
      };

      const state = userSlice.reducer(
        currentState,
        checkAuthAction.rejected(
          new Error('Request failed'),
          'request-id',
          undefined,
        ),
      );

      expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(state.userInfo).toBeNull();
    });
  });

  describe('authorizeUserAction', () => {
    it('sets auth status and user info on fulfilled', () => {
      const userInfo = makeFakeUserInfo();

      const state = userSlice.reducer(
        initialState,
        authorizeUserAction.fulfilled(userInfo, 'request-id', {
          email: userInfo.email,
          password: 'password',
        }),
      );

      expect(state.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(state.userInfo).toBe(userInfo);
    });

    it('sets no auth status and clears user info on rejected', () => {
      const currentState: TUserState = {
        ...initialState,
        authorizationStatus: AuthorizationStatus.Auth,
        userInfo: makeFakeUserInfo(),
      };

      const state = userSlice.reducer(
        currentState,
        authorizeUserAction.rejected(
          new Error('Request failed'),
          'request-id',
          {
            email: 'test@example.com',
            password: 'password',
          },
        ),
      );

      expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(state.userInfo).toBeNull();
    });
  });

  describe('logoutAction', () => {
    it('sets no auth status and clears user info on fulfilled', () => {
      const currentState: TUserState = {
        ...initialState,
        authorizationStatus: AuthorizationStatus.Auth,
        userInfo: makeFakeUserInfo(),
      };

      const state = userSlice.reducer(
        currentState,
        logoutAction.fulfilled(undefined, 'request-id', undefined),
      );

      expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(state.userInfo).toBeNull();
    });
  });

  describe('registerUserAction', () => {
    const registrationPayload = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
      avatar: null,
    };

    it('resets registration state on pending', () => {
      const currentState: TUserState = {
        ...initialState,
        authorizationStatus: AuthorizationStatus.Auth,
        registrationStatus: RegistrationStatus.Error,
        userInfo: makeFakeUserInfo(),
        isAvatarLoadingError: true,
      };

      const state = userSlice.reducer(
        currentState,
        registerUserAction.pending('request-id', registrationPayload),
      );

      expect(state.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(state.userInfo).toBeNull();
      expect(state.isAvatarLoadingError).toBe(false);
      expect(state.registrationStatus).toBe(RegistrationStatus.Idle);
    });

    it('sets success status and avatar loading error on fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        registerUserAction.fulfilled(
          {
            user: makeFakeUserInfo(),
            isAvatarLoadingError: true,
          },
          'request-id',
          registrationPayload,
        ),
      );

      expect(state.registrationStatus).toBe(RegistrationStatus.Success);
      expect(state.isAvatarLoadingError).toBe(true);
    });

    it('sets error status on rejected', () => {
      const state = userSlice.reducer(
        initialState,
        registerUserAction.rejected(
          new Error('Request failed'),
          'request-id',
          registrationPayload,
        ),
      );

      expect(state.registrationStatus).toBe(RegistrationStatus.Error);
    });
  });
});
