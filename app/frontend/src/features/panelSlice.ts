import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PanelState = {
  show: boolean;
  dialogBlock: boolean;
  block: boolean;
};

const initialState = (): PanelState => ({
  show: false,
  dialogBlock: false,
  block: false
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
    }
  }
});

export const {
  showPanel,
  hidePanel,
  setDialogBlock,
  setBlock
} = panelSlice.actions;

export default panelSlice.reducer;
