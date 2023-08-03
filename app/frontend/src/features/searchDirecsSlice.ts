import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiPlace } from "../domain/types";
import { deleteItemImmutable, fromtoItemImmutable, updateItemImmutable } from "./immutable";

type SearchDirectState = {
  sequence: UiPlace[];
}

function initialState(): SearchDirectState {
  return { sequence: [] };
};

export const searchDirecsSlice = createSlice({
  name: "search/direcs",
  initialState: initialState(),
  reducers: {
    setSearchDirecsSequence: (state, action: PayloadAction<UiPlace[]>) => { state.sequence = action.payload; },
    appendSearchDirecsPlace: (state, action: PayloadAction<UiPlace>) => { state.sequence.push(action.payload); },
    updateSearchDirecsPlace: (state, action: PayloadAction<{ place: UiPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.sequence = updateItemImmutable(state.sequence, place, index);
    },
    deleteSearchDirecsPlace: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.sequence = deleteItemImmutable(state.sequence, index);
    },
    fromtoSearchDirecsPlace: (state, action: PayloadAction<{ fr: number, to: number }>) => {
      const { fr, to } = action.payload;
      state.sequence = fromtoItemImmutable(state.sequence, fr, to);
    }
  }
});

export const {
  setSearchDirecsSequence,
  appendSearchDirecsPlace,
  updateSearchDirecsPlace,
  deleteSearchDirecsPlace,
  fromtoSearchDirecsPlace
} = searchDirecsSlice.actions;

export default searchDirecsSlice.reducer;
