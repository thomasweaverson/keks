export type User = {
  name: string;
  avatarUrl: string;
};

export type UserData = User & {
  email: string;
  token: string;
};

export type UserInfo = {
  name: UserData["name"];
  email: UserData["email"];
  avatarUrl?: string;
};

export type RegistrationData = {
  name: UserData["name"];
  email: UserData["email"];
  password: string;
};

export type RegistrationPayload = RegistrationData & {
  avatar?: File | null;
};

export type RegistrationResult = {
  user: UserData;
  isAvatarLoadingError: boolean;
};

export type UploadAvatarData = {
  avatar: File;
  token: string;
};

export type AuthData = {
  email: UserData["email"];
  password: RegistrationData["password"];
};
