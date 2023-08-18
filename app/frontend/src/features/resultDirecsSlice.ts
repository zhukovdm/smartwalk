import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiDirec } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultDirecsState = {
  index: number;
  result: UiDirec[];
};

const initialState = (): ResultDirecsState => ({
  index: 0,
  result: []
});

export const resultDirecsSlice = createSlice({
  name: "result/direcs",
  initialState: initialState(),
  reducers: {
    setResultDirecs: (state, action: PayloadAction<UiDirec[]>) => {
      state.result = action.payload;
    },
    updateResultDirec: (state, action: PayloadAction<{ direc: UiDirec, index: number }>) => {
      const { direc, index } = action.payload;
      state.result = updateItemImmutable(state.result, direc, index);
    },
    setResultDirecsIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    }
  }
});

export const {
  setResultDirecs,
  setResultDirecsIndex,
  updateResultDirec,
} = resultDirecsSlice.actions;

export default resultDirecsSlice.reducer;
