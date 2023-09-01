import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiPlace } from "../domain/types";
import {
  deleteItemImmutable,
  fromToItemImmutable,
  updateItemImmutable
} from "../utils/functions";

type SearchDirectState = {
  waypoints: UiPlace[];
}

const initialState = (): SearchDirectState => ({ waypoints: [] });

export const searchDirecsSlice = createSlice({
  name: "search/direcs",
  initialState: initialState(),
  reducers: {
    resetSearchDirecs: () => initialState(),
    reverseSearchDirecsWaypoints: (state) => {
      state.waypoints = [...state.waypoints].reverse();
    },
    appendSearchDirecsPlace: (state, action: PayloadAction<UiPlace>) => {
      state.waypoints.push(action.payload);
    },
    updateSearchDirecsPlace: (state, action: PayloadAction<{ place: UiPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.waypoints = updateItemImmutable(state.waypoints, place, index);
    },
    deleteSearchDirecsPlace: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.waypoints = deleteItemImmutable(state.waypoints, index);
    },
    fromtoSearchDirecsPlace: (state, action: PayloadAction<{ fr: number, to: number }>) => {
      const { fr, to } = action.payload;
      state.waypoints = fromToItemImmutable(state.waypoints, fr, to);
    }
  }
});

export const {
  resetSearchDirecs,
  reverseSearchDirecsWaypoints,
  appendSearchDirecsPlace,
  updateSearchDirecsPlace,
  deleteSearchDirecsPlace,
  fromtoSearchDirecsPlace
} = searchDirecsSlice.actions;

export default searchDirecsSlice.reducer;
