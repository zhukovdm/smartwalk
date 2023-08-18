import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SolidState = {
  activated: boolean;
  availablePods?: string[];
  redirect: boolean;
  selectedPod: string | null;
  webId: string;
};

const initialState = (): SolidState => ({
  activated: false,
  redirect: false,
  selectedPod: null,
  webId: ""
});

export const solidSlice = createSlice({
  name: "solid",
  initialState: initialState(),
  reducers: {
    resetSolid: () => initialState(),
    activateSolid: (state) => {
      state.activated = true;
    },
    setSolidRedirect: (state) => {
      state.redirect = true;
    },
    setSolidSelectedPod: (state, action: PayloadAction<string | null>) => {
      state.selectedPod = action.payload;
    },
    setSolidAvailablePods: (state, action: PayloadAction<string[]>) => {
      state.availablePods = action.payload;
    },
    setSolidWebId: (state, action: PayloadAction<string>) => {
      state.webId = action.payload;
    }
  }
});

export const {
  resetSolid,
  activateSolid,
  setSolidRedirect,
  setSolidSelectedPod,
  setSolidAvailablePods,
  setSolidWebId,
} = solidSlice.actions;

export default solidSlice.reducer;
