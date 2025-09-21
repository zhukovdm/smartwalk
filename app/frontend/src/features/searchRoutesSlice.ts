import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Arrow, KeywordCategory, UiPlace } from "../domain/types";
import { deleteItemImmutable, updateItemImmutable } from "../utils/functions";

export type SearchRoutesState = {
  source?: UiPlace;
  target?: UiPlace;
  maxDistance: number;
  categories: KeywordCategory[];
  arrows: Arrow[];
};

export const initialSearchRoutesState = (): SearchRoutesState => ({
  maxDistance: 3.0,
  categories: [],
  arrows: []
});

export const searchRoutesSlice = createSlice({
  name: "search/routes",
  initialState: initialSearchRoutesState(),
  reducers: {
    resetSearchRoutes: () => initialSearchRoutesState(),
    setSearchRoutesSource: (state, action: PayloadAction<UiPlace | undefined>) => {
      state.source = action.payload;
    },
    setSearchRoutesTarget: (state, action: PayloadAction<UiPlace | undefined>) => {
      state.target = action.payload;
    },
    setSearchRoutesMaxDistance: (state, action: PayloadAction<number>) => {
      state.maxDistance = action.payload;
    },
    appendSearchRoutesCategory: (state, action: PayloadAction<KeywordCategory>) => {
      state.categories.push(action.payload);
    },
    deleteSearchRoutesCategory: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.categories = deleteItemImmutable(state.categories, i);
      state.arrows = [];
    },
    updateSearchRoutesCategory: (state, action: PayloadAction<{ category: KeywordCategory; i: number; }>) => {
      const { category, i } = action.payload;
      state.categories = updateItemImmutable(state.categories, category, i);
    },
    appendSearchRoutesArrow: (state, action: PayloadAction<Arrow>) => {
      state.arrows.push(action.payload);
    },
    deleteSearchRoutesArrow: (state, action: PayloadAction<number>) => {
      state.arrows = deleteItemImmutable(state.arrows, action.payload);
    }
  }
});

export const {
  resetSearchRoutes,
  setSearchRoutesSource,
  setSearchRoutesTarget,
  setSearchRoutesMaxDistance,
  appendSearchRoutesCategory,
  deleteSearchRoutesCategory,
  updateSearchRoutesCategory,
  appendSearchRoutesArrow,
  deleteSearchRoutesArrow
} = searchRoutesSlice.actions;

export default searchRoutesSlice.reducer;
