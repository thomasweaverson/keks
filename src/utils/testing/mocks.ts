import type { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import type { AxiosInstance } from 'axios';
import type { TState } from '../../types/state';
import type {
  TProduct,
  TProductExtended,
  TReview,
  TCategoryWithTypes,
  TProductCategory,
  TProductType,
  TReviewPosting,
} from '../../types/product';
import {
  AuthorizationStatus,
  LoadingStatus,
  RegistrationStatus,
} from '../../const/infrastructure';
import {
  DEFAULT_REVIEWS_FILTER,
  DEFAULT_REVIEWS_SORT_ORDER,
} from '../../const/business';
import type { TUserInfo } from '../../types/user';

export type AppThunkDispatch = ThunkDispatch<
  TState,
  { api: AxiosInstance },
  Action
>;

export const extractActionsTypes = (actions: Action[]) =>
  actions.map(({ type }) => type);

export const makeFakeState = (initialState?: Partial<TState>): TState => ({
  Products: {
    products: [],
    productsLoadingStatus: LoadingStatus.Idle,
    randomPack: null,
  },
  Product: {
    product: null,
    productLoadingStatus: LoadingStatus.Idle,
    isProductNotFound: false,
  },
  User: {
    authorizationStatus: AuthorizationStatus.Unknown,
    registrationStatus: RegistrationStatus.Idle,
    userInfo: null,
    isAvatarLoadingError: false,
  },
  Favorites: {
    favorites: [],
    favoritesLoadingStatus: LoadingStatus.Idle,
  },
  Reviews: {
    reviews: [],
    reviewsLoadingStatus: LoadingStatus.Idle,
    lastReview: null,
    lastReviewLoadingStatus: LoadingStatus.Idle,
    currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
    currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
  },
  Filter: {
    filters: [],
    currentCategory: null,
    currentTypes: [],
    filtersLoadingStatus: LoadingStatus.Idle,
  },
  ...(initialState ?? {}),
});

export const makeFakeProduct = (override?: Partial<TProduct>): TProduct => ({
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  category: faker.helpers.arrayElement<TProductCategory>([
    'cheesecake',
    'bisque',
    'shortbread',
    'dessert',
  ]),
  type: faker.helpers.arrayElement<TProductType>([
    'basket-cake',
    'brand-muffin',
    'chocolate',
    'chocolate-muffin',
    'funnel-cake',
    'honey-cake',
    'lemon',
    'new-york',
    'tart',
    'vanilla',
    'vegetarian',
  ]),
  price: Number(faker.commerce.price({ min: 100, max: 2000 })),
  previewImage: faker.image.url(),
  previewImageWebp: faker.image.url(),
  isFavorite: faker.datatype.boolean(),
  isNew: faker.datatype.boolean(),
  ...override,
});

export const makeFakeRandomPack = (): [TProduct, TProduct, TProduct] => [
  makeFakeProduct(),
  makeFakeProduct(),
  makeFakeProduct(),
];

export const makeFakeProductExtended = (
  override?: Partial<TProductExtended>,
): TProductExtended => ({
  ...makeFakeProduct(),
  description: faker.commerce.productDescription(),
  images: [faker.image.url(), faker.image.url()],
  weight: faker.number.int({ min: 100, max: 1500 }),
  rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
  reviewCount: faker.number.int({ min: 0, max: 100 }),
  ...override,
});

export const makeFakeUserInfo = (override?: Partial<TUserInfo>): TUserInfo => ({
  name: faker.person.fullName(),
  avatarUrl: faker.image.avatar(),
  email: faker.internet.email(),
  token: faker.string.alphanumeric(32),
  ...override,
});

export const makeFakeReview = (override?: Partial<TReview>): TReview => ({
  id: faker.string.uuid(),
  isoDate: faker.date.recent().toISOString(),
  user: {
    name: faker.person.fullName(),
    avatarUrl: faker.image.avatar(),
  },
  positive: faker.lorem.sentence(),
  negative: faker.lorem.sentence(),
  rating: faker.number.int({ min: 1, max: 5 }),
  ...override,
});

export const makeFakeReviewPosting = (
  override?: Partial<TReviewPosting>,
): TReviewPosting => ({
  id: faker.string.uuid(),
  positive: faker.lorem.sentence(),
  negative: faker.lorem.sentence(),
  rating: faker.number.int({ min: 1, max: 5 }),
  ...override,
});

export const makeFakeCategoryWithTypes = (
  category: TProductCategory = 'cheesecake',
  types: TProductType[] = ['lemon'],
): TCategoryWithTypes => ({
  category,
  types,
});
