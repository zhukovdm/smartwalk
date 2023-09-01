import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";
import { updateItemImmutable } from "../utils/functions";

type ResultPlacesState = {
  result?: PlacesResult;
  filters: boolean[];
  page: number;
  pageSize: number;
};

const initialState = (pageSize: number): ResultPlacesState => ({
  filters: [],
  page: 0,
  pageSize: pageSize
});

export const resultPlacesSlice = createSlice({
  name: "result/places",
  initialState: initialState(10),
  reducers: {
    resetResultPlaces: (state) => initialState(state.pageSize),
    setResultPlaces: (state, action: PayloadAction<PlacesResult>) => {
      state.result = action.payload;
      state.filters = action.payload.categories.map(() => true) ?? [];
    },
    toggleResultPlacesFilter: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.filters = updateItemImmutable(state.filters, !state.filters[i], i);
    },
    setResultPlacesPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setResultPlacesPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    }
  }
});

export const {
  resetResultPlaces,
  setResultPlaces,
  toggleResultPlacesFilter,
  setResultPlacesPage,
  setResultPlacesPageSize
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
