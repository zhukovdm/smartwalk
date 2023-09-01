import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiDirec } from "../domain/types";
import { updateItemImmutable } from "../utils/functions";

type ResultDirecsState = {
  index: number;
  result: UiDirec[];
};

const initialResultDirecsState = (): ResultDirecsState => ({
  index: 0,
  result: []
});

export const resultDirecsSlice = createSlice({
  name: "result/direcs",
  initialState: initialResultDirecsState(),
  reducers: {
    resetResultDirecs: () => initialResultDirecsState(),
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
  resetResultDirecs,
  setResultDirecs,
  setResultDirecsIndex,
  updateResultDirec,
} = resultDirecsSlice.actions;

export default resultDirecsSlice.reducer;
