import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";
import { updateItemImmutable } from "../utils/functions";

type ResultRoutesState = {
  index: number;
  result: UiRoute[];
  categoryFilters: boolean[];
};

export const initialResultRoutesState = (): ResultRoutesState => ({
  index: 0,
  result: [],
  categoryFilters: []
});

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialResultRoutesState(),
  reducers: {
    resetResultRoutes: () => initialResultRoutesState(),
    setResultRoutes: (state, action: PayloadAction<UiRoute[]>) => {
      const r = action.payload;
      state.result = r;
      state.categoryFilters = r[0]?.categories.map(() => true) ?? [];
    },
    updateResultRoute: (state, action: PayloadAction<{ route: UiRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.result = updateItemImmutable(state.result, route, index);
    },
    toggleResultRoutesFilter: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.categoryFilters = updateItemImmutable(state.categoryFilters, !state.categoryFilters[i], i);
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
