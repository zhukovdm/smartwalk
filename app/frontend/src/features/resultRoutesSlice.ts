import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultRoutesState = {
  filters: boolean[];
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
    resetResultRoutes: () => initialState(),
    setResultRoutes: (state, action: PayloadAction<UiRoute[]>) => {
      const r = action.payload;
      state.result = r;
      state.filters = (r.length > 0) ? r[0].categories.map(() => true) : [];
    },
    updateResultRoute: (state, action: PayloadAction<{ route: UiRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.result = updateItemImmutable(state.result, route, index);
    },
    setResultRoutesFilter: (state, action: PayloadAction<{ filter: boolean; index: number; }>) => {
      const { filter, index } = action.payload;
      state.filters = updateItemImmutable(state.filters, filter, index);
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
  setResultRoutesFilter,
  setResultRoutesIndex
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
