import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultRoutesState = {
  back?: string;
  index: number;
  result: UiRoute[];
  filters: string[];
};

const initialState = (): ResultRoutesState => {
  return { index: 0, result: [], filters: [] };
}

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialState(),
  reducers: {
    setResultRoutes: (state, action: PayloadAction<UiRoute[]>) => { state.result = action.payload; },
    updateResultRoute: (state, action: PayloadAction<{ route: UiRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.result = updateItemImmutable(state.result, route, index);
    },
    setResultRoutesBack: (state, action: PayloadAction<string | undefined>) => { state.back = action.payload; },
    setResultRoutesIndex: (state, action: PayloadAction<number>) => { state.index = action.payload; },
    setResultRoutesFilters: (state, action: PayloadAction<string[]>) => { state.filters = action.payload; }
  }
});

export const {
  setResultRoutes,
  updateResultRoute,
  setResultRoutesBack,
  setResultRoutesIndex,
  setResultRoutesFilters
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
