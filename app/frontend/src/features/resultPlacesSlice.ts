import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultPlacesState = {
  result?: PlacesResult;
  filters: boolean[];
  page: number;
  pageSize: number;
};

const initialState = (): ResultPlacesState => ({
  filters: [],
  page: 0,
  pageSize: 10
});

export const resultPlacesSlice = createSlice({
  name: "result/places",
  initialState: initialState(),
  reducers: {
    setResultPlaces: (state, action: PayloadAction<PlacesResult | undefined>) => {
      state.result = action.payload;
      state.filters = action.payload?.categories.map(() => true) ?? [];
    },
    updateResultPlacesFilter: (state, action: PayloadAction<{ filter: boolean, index: number }>) => {
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
  setResultPlaces,
  updateResultPlacesFilter,
  setResultPlacesPage,
  setResultPlacesPageSize
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
