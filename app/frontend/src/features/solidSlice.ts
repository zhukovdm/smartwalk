import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SolidState = {
  webId: string;
  redirect: boolean;
  selectedPod: string | null;
  availablePods?: string[];
  placesCurCount?: number;
  placesTotCount?: number;
  routesCurCount?: number;
  routesTotCount?: number;
  direcsCurCount?: number;
  direcsTotCount?: number;
};

const initialState = (): SolidState => {
  return {
    webId: "",
    redirect: false,
    selectedPod: null
  };
}

export const solidSlice = createSlice({
  name: "solid",
  initialState: initialState(),
  reducers: {
    resetSolid: () => { return initialState(); },
    setSolidRedirect: (state) => { state.redirect = true; },
    setSolidWebId: (state, action: PayloadAction<string>) => { state.webId = action.payload; },
    setSolidSelectedPod: (state, action: PayloadAction<string | null>) => { state.selectedPod = action.payload; },
    setSolidAvailablePods: (state, action: PayloadAction<string[]>) => { state.availablePods = action.payload; },
    setSolidPlacesCurCount: (state, action: PayloadAction<number>) => { state.placesCurCount = action.payload; },
    setSolidPlacesTotCount: (state, action: PayloadAction<number>) => { state.placesTotCount = action.payload; },
    setSolidRoutesCurCount: (state, action: PayloadAction<number>) => { state.routesCurCount = action.payload; },
    setSolidRoutesTotCount: (state, action: PayloadAction<number>) => { state.routesTotCount = action.payload; },
    setSolidDirecsCurCount: (state, action: PayloadAction<number>) => { state.direcsCurCount = action.payload; },
    setSolidDirecsTotCount: (state, action: PayloadAction<number>) => { state.direcsTotCount = action.payload; }
  }
});

export const {
  resetSolid,
  setSolidRedirect,
  setSolidWebId,
  setSolidSelectedPod,
  setSolidAvailablePods,
  setSolidPlacesCurCount,
  setSolidPlacesTotCount,
  setSolidRoutesCurCount,
  setSolidRoutesTotCount,
  setSolidDirecsCurCount,
  setSolidDirecsTotCount
} = solidSlice.actions;

export default solidSlice.reducer;
