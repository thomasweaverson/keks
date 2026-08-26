import { createSlice } from "@reduxjs/toolkit";
import {
  AuthorizationStatus,
  NameSpace,
  RegistrationStatus,
} from "../../../const/infrastructure";
import type { TUserState } from "../../../types/state";
import {
  authorizeUserAction,
  checkAuthAction,
  logoutAction,
  registerUserAction,
} from "../../api-actions";

const initialState: TUserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  registrationStatus: RegistrationStatus.Idle,
  userInfo: null,
  isAvatarLoadingError: false,
};

export const userSlice = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userInfo = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      })
      .addCase(authorizeUserAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userInfo = action.payload;
      })
      .addCase(authorizeUserAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      })
      .addCase(registerUserAction.pending, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
        state.isAvatarLoadingError = false;
        state.registrationStatus = RegistrationStatus.Idle;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.isAvatarLoadingError = action.payload.isAvatarLoadingError;
        state.registrationStatus = RegistrationStatus.Success;
      })
      .addCase(registerUserAction.rejected, (state) => {
        state.registrationStatus = RegistrationStatus.Error;
      });
  },
});
