export type TUser = {
  name: string;
  avatarUrl: string | null;
};

export type TUserData = TUser & {
  email: string;
  token: string;
};

export type TUserInfo = {
  name: TUserData["name"];
  email: TUserData["email"];
  avatarUrl?: string;
};

type TRegistrationData = {
  name: TUserData["name"];
  email: TUserData["email"];
  password: string;
};

export type TRegistrationPayload = TRegistrationData & {
  avatar?: File | null;
};

export type TRegistrationResult = {
  user: TUserData;
  isAvatarLoadingError: boolean;
};

export type TAuthData = {
  email: TUserData["email"];
  password: TRegistrationData["password"];
};
