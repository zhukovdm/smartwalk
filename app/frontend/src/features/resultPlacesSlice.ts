import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";
import { updateItemImmutable } from "./immutable";

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
    setResultPlacesFilter: (state, action: PayloadAction<{ filter: boolean, index: number; }>) => {
      const { filter, index } = action.payload;
      state.filters = updateItemImmutable(state.filters, filter, index);
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
  setResultPlacesFilter,
  setResultPlacesPage,
  setResultPlacesPageSize
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
