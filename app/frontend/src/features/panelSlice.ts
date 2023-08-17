import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoundsAdvice } from "../domain/types";

type PanelState = {
  show: boolean;
  block: boolean;
  dialogBlock: boolean;
  bounds?: BoundsAdvice;
};

const initialState = (): PanelState => ({
  show: false,
  block: false,
  dialogBlock: false
});

export const panelSlice = createSlice({
  name: "panel",
  initialState: initialState(),
  reducers: {
    showPanel: (state) => {
      state.show = true;
    },
    hidePanel: (state) => {
      state.show = false;
    },
    setBlock: (state, action: PayloadAction<boolean>) => {
      state.block = action.payload;
    },
    setDialogBlock: (state, action: PayloadAction<boolean>) => {
      state.dialogBlock = action.payload;
    },
    setBounds: (state, action: PayloadAction<BoundsAdvice>) => {
      state.bounds = action.payload;
    }
  }
});

export const {
  showPanel,
  hidePanel,
  setBlock,
  setDialogBlock,
  setBounds
} = panelSlice.actions;

export default panelSlice.reducer;
