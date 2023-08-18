import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultRoutesState = {
  filters: string[];
  index: number;
  result: UiRoute[];
};

const initialState = (): ResultRoutesState => ({
  filters: [],
  index: 0,
  result: [],
});

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialState(),
  reducers: {
    setResultRoutes: (state, action: PayloadAction<UiRoute[]>) => {
      state.result = action.payload;
    },
    updateResultRoute: (state, action: PayloadAction<{ route: UiRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.result = updateItemImmutable(state.result, route, index);
    },
    setResultRoutesIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
    setResultRoutesFilters: (state, action: PayloadAction<string[]>) => {
      state.filters = action.payload;
    }
  }
});

export const {
  setResultRoutes,
  setResultRoutesIndex,
  setResultRoutesFilters,
  updateResultRoute
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
