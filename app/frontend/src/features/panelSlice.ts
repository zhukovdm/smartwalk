import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bounds } from "../domain/types";

type PanelState = {
  show: boolean;
  block: boolean;
  bounds?: Bounds;
};

const initialState = (): PanelState => {
  return { show: false, block: false };
}

export const panelSlice = createSlice({
  name: "panel",
  initialState: initialState(),
  reducers: {
    showPanel: (state) => { state.show = true;  },
    hidePanel: (state) => { state.show = false; },
    setBlock: (state, action: PayloadAction<boolean>) => { state.block = action.payload; },
    setBounds: (state, action: PayloadAction<Bounds>) => { state.bounds = action.payload; }
  }
});

export const {
  showPanel,
  hidePanel,
  setBlock,
  setBounds
} = panelSlice.actions;

export default panelSlice.reducer;
