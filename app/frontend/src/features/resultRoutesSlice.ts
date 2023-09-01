import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";
import { updateItemImmutable } from "../utils/functions";

type ResultRoutesState = {
  index: number;
  result: UiRoute[];
  resultFilters: boolean[];
};

const initialState = (): ResultRoutesState => ({
  index: 0,
  result: [],
  resultFilters: []
});

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialState(),
  reducers: {
    resetResultRoutes: () => initialState(),
    setResultRoutes: (state, action: PayloadAction<UiRoute[]>) => {
      const r = action.payload;
      state.result = r;
      state.resultFilters = r[0]?.categories.map(() => true) ?? [];
    },
    updateResultRoute: (state, action: PayloadAction<{ route: UiRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.result = updateItemImmutable(state.result, route, index);
    },
    toggleResultRoutesFilter: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.resultFilters = updateItemImmutable(state.resultFilters, !state.resultFilters[i], i);
    },
    setResultRoutesIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    }
  }
});

export const {
  resetResultRoutes,
  setResultRoutes,
  updateResultRoute,
  toggleResultRoutesFilter,
  setResultRoutesIndex
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
