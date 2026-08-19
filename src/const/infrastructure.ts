export const BACKEND_URL = "https://grading.design.htmlacademy.pro/v0/keks";

export const REQUEST_TIMEOUT = 3000;

export const NameSpace = {
  User: "USER",
  App: "App",
} as const;

export const APIRoute = {
  Products: "/products",
  Categories: "/categories",
  Favorites: "/favorites",
  Reviews: "/reviews",
  LastReview: "/reviews/getLast",
  Registration: "/users/registration",
  UploadAvatar: "/users/upload",
  Login: "/users/login",
  Logout: "/uses/logout",
} as const;
