import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const/infrastructure';
import { productsSlice } from './slices/products/products.slice';
import { productSlice } from './slices/product/product.slice';
import { filterSlice } from './slices/filter/filter.slice';
import { reviewsSlice } from './slices/reviews/reviews.slice';
import { favoritesSlice } from './slices/favorites/favorites.slice';
import { userSlice } from './slices/user/user.slice';

export const rootReducer = combineReducers({
  [NameSpace.Products]: productsSlice.reducer,
  [NameSpace.Product]: productSlice.reducer,
  [NameSpace.Filter]: filterSlice.reducer,
  [NameSpace.Reviews]: reviewsSlice.reducer,
  [NameSpace.Favorites]: favoritesSlice.reducer,
  [NameSpace.User]: userSlice.reducer,
});
