import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TFilterState } from "../../../types/state";
import { NameSpace } from "../../../const/infrastructure";
import { fetchFiltersAction } from "../../api-actions";
import type { TProductCategory, TProductType } from "../../../types/product";

const initialState: TFilterState = {
  filters: [],
  currentCategory: null,
  currentTypes: [],
  isFiltersLoadingError: false,
};

export const filterSlice = createSlice({
  name: NameSpace.Filter,
  initialState,
  reducers: {
    resetFilter: (state) => {
      state.currentCategory = null;
      state.currentTypes = [];
    },
    setCategory: (state, action: PayloadAction<TProductCategory | null>) => {
      if (state.currentCategory !== action.payload) {
        state.currentCategory = action.payload;
        state.currentTypes = [];
      }
    },
    toggleType: (state, action: PayloadAction<TProductType>) => {
      const type = action.payload;
      const index = state.currentTypes.indexOf(type);

      if (index === -1) {
        state.currentTypes.push(type);
      } else {
        state.currentTypes.splice(index, 1);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFiltersAction.fulfilled, (state, action) => {
        state.filters = action.payload;
        state.isFiltersLoadingError = false;
      })
      .addCase(fetchFiltersAction.rejected, (state) => {
        state.isFiltersLoadingError = true;
      });
  },
});

export const { resetFilter, setCategory, toggleType } = filterSlice.actions;
