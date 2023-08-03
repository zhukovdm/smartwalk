import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";

type ResultPlacesState = {
  result?: PlacesResult;
  filters: string[];
};

function initialState(): ResultPlacesState { return { filters: [] }; };

export const resultPlacesSlice = createSlice({
  name: "result/places",
  initialState: initialState(),
  reducers: {
    setResultPlaces: (state, action: PayloadAction<PlacesResult | undefined>) => { state.result = action.payload; },
    setResultPlacesFilters: (state, action: PayloadAction<string[]>) => { state.filters = action.payload; }
  }
});

export const {
  setResultPlaces,
  setResultPlacesFilters
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
