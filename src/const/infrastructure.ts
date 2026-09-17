export const BACKEND_URL = 'https://grading.design.htmlacademy.pro/v0/keks';

export const REQUEST_TIMEOUT = 6000;

export const NameSpace = {
  Products: 'Products',
  Product: 'Product',
  User: 'User',
  Favorites: 'Favorites',
  Reviews: 'Reviews',
  Filter: 'Filter',
} as const;

export const APIRoute = {
  Products: '/products',
  Categories: '/categories',
  Favorites: '/favorites',
  Reviews: '/reviews',
  LastReview: '/reviews/getLast',
  Registration: '/users/registration',
  UploadAvatar: '/users/upload',
  Login: '/users/login',
  Logout: '/users/logout',
} as const;

export const AuthorizationStatus = {
  Auth: 'AUTH',
  NoAuth: 'NO_AUTH',
  Unknown: 'UNKNOWN',
} as const;

export const RegistrationStatus = {
  Idle: 'IDLE',
  Success: 'SUCCESS',
  Error: 'ERROR',
} as const;

export const AppRoute = {
  Root: '/',
  Catalog: '/catalog',
  Product: '/product',
  Favorites: '/favorites',
  Login: '/login',
  Registration: '/registration',
  NotFound: '/not-found',
} as const;

export const LoadingStatus = {
  Idle: 'IDLE',
  Loading: 'LOADING',
  Loaded: 'LOADED',
  Failed: 'FAILED',
} as const;
