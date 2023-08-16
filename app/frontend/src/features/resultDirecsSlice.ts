import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiDirec } from "../domain/types";

type ResultDirecsState = {
  result: UiDirec[];
};

const initialState = (): ResultDirecsState => ({ result: [] });

export const resultDirecsSlice = createSlice({
  name: "result/direcs",
  initialState: initialState(),
  reducers: {
    setResultDirecs: (state, action: PayloadAction<UiDirec[]>) => {
      state.result = action.payload;
    },
  }
});

export const {
  setResultDirecs
} = resultDirecsSlice.actions;

export default resultDirecsSlice.reducer;
