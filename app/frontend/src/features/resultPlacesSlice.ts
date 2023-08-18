import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultPlacesState = {
  result?: PlacesResult;
  filters: boolean[];
};

const initialState = (): ResultPlacesState => ({ filters: [] });

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
    }
  }
});

export const {
  setResultPlaces,
  updateResultPlacesFilter
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
