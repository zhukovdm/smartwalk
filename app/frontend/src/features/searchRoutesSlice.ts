import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KeywordCategory, PrecedenceEdge, UiPlace } from "../domain/types";
import { deleteItemImmutable, updateItemImmutable } from "./immutable";

type SearchRoutesState = {
  source?: UiPlace;
  target?: UiPlace;
  distance: number;
  categories: KeywordCategory[];
  precedence: PrecedenceEdge[];
};

const initialState = (): SearchRoutesState => ({ distance: 5.0, categories: [], precedence: [] });

export const searchRoutesSlice = createSlice({
  name: "search/routes",
  initialState: initialState(),
  reducers: {
    resetSearchRoutes: () => initialState(),
    setSearchRoutesSource: (state, action: PayloadAction<UiPlace | undefined>) => {
      state.source = action.payload;
    },
    setSearchRoutesTarget: (state, action: PayloadAction<UiPlace | undefined>) => {
      state.target = action.payload;
    },
    setSearchRoutesDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload;
    },
    deleteSearchRoutesCategory: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.categories = deleteItemImmutable(state.categories, i);
      state.precedence = [];
    },
    updateSearchRoutesCategory: (state, action: PayloadAction<{ category: KeywordCategory; i: number; }>) => {
      const { category, i } = action.payload;
      state.categories = updateItemImmutable(state.categories, category, i);
    },
    appendSearchRoutesPrecEdge: (state, action: PayloadAction<PrecedenceEdge>) => {
      state.precedence.push(action.payload);
    },
    deleteSearchRoutesPrecEdge: (state, action: PayloadAction<number>) => {
      state.precedence = deleteItemImmutable(state.precedence, action.payload);
    }
  }
});

export const {
  resetSearchRoutes,
  setSearchRoutesSource,
  setSearchRoutesTarget,
  setSearchRoutesDistance,
  deleteSearchRoutesCategory,
  updateSearchRoutesCategory,
  appendSearchRoutesPrecEdge,
  deleteSearchRoutesPrecEdge
} = searchRoutesSlice.actions;

export default searchRoutesSlice.reducer;
