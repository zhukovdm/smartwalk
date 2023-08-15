import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KeywordCategory, UiPlace } from "../domain/types";

type SearchRoutesState = {
  source?: UiPlace;
  target?: UiPlace;
  distance: number;
  conditions: KeywordCategory[];
};

function initialState(): SearchRoutesState {
  return { distance: 5.0, conditions: [] };
}

export const searchRoutesSlice = createSlice({
  name: "search/routes",
  initialState: initialState(),
  reducers: {
    clearSearchRoutes: () => { return initialState(); },
    setSearchRoutesSource: (state, action: PayloadAction<UiPlace | undefined>) => { state.source = action.payload; },
    setSearchRoutesTarget: (state, action: PayloadAction<UiPlace | undefined>) => { state.target = action.payload; },
    setSearchRoutesDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; },
    deleteSearchRoutesCondition: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.conditions = [...state.conditions.slice(0, i), ...state.conditions.slice(i + 1)];
    },
    insertSearchRoutesCondition: (state, action: PayloadAction<{ condition: KeywordCategory; i: number; }>) => {
      const { i, condition } = action.payload;
      state.conditions = [...state.conditions.slice(0, i), condition, ...state.conditions.slice(i + 1)];
    }
  }
});

export const {
  clearSearchRoutes,
  setSearchRoutesSource,
  setSearchRoutesTarget,
  setSearchRoutesDistance,
  deleteSearchRoutesCondition,
  insertSearchRoutesCondition
} = searchRoutesSlice.actions;

export default searchRoutesSlice.reducer;
