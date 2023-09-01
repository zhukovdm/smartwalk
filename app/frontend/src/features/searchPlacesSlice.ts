import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KeywordCategory, UiPlace } from "../domain/types";
import { deleteItemImmutable, updateItemImmutable } from "../utils/functions";

type SearchPlacesState = {
  center?: UiPlace;
  radius: number;
  categories: KeywordCategory[];
};

const initialState = (): SearchPlacesState => ({ radius: 3.0, categories: [] });

export const placesSlice = createSlice({
  name: "search/places",
  initialState: initialState(),
  reducers: {
    resetSearchPlaces: () => initialState(),
    setSearchPlacesCenter: (state, action: PayloadAction<UiPlace | undefined>) => {
      state.center = action.payload;
    },
    setSearchPlacesRadius: (state, action: PayloadAction<number>) => {
      state.radius = action.payload;
    },
    deleteSearchPlacesCategory: (state, action: PayloadAction<number>) => {
      state.categories = deleteItemImmutable(state.categories, action.payload);
    },
    updateSearchPlacesCategory: (state, action: PayloadAction<{ category: KeywordCategory; i: number; }>) => {
      const { category, i } = action.payload;
      state.categories = updateItemImmutable(state.categories, category, i);
    }
  }
});

export const {
  resetSearchPlaces,
  setSearchPlacesCenter,
  setSearchPlacesRadius,
  deleteSearchPlacesCategory,
  updateSearchPlacesCategory
} = placesSlice.actions;

export default placesSlice.reducer;
