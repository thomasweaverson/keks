export type TUser = {
  name: string;
  avatarUrl: string | null;
};

export type TUserInfo = TUser & {
  email: string;
  token: string;
};

type TRegistrationData = {
  name: TUserInfo['name'];
  email: TUserInfo['email'];
  password: string;
};

export type TRegistrationPayload = TRegistrationData & {
  avatar?: File | null;
};

export type TRegistrationResult = {
  user: TUserInfo;
  isAvatarLoadingError: boolean;
};

export type TAuthData = {
  email: TUserInfo['email'];
  password: TRegistrationData['password'];
};
