import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { StoredDirec, StoredPlace, StoredRoute } from "../domain/types";

type ViewerStateType = {
  direc?: StoredDirec;
  place?: StoredPlace;
  route?: StoredRoute;
};

const initialState = (): ViewerStateType => ({ });

export const viewerSlice = createSlice({
  name: "viewer",
  initialState: initialState(),
  reducers: {
    setViewerDirec: (state, action: PayloadAction<StoredDirec>) => {
      state.direc = action.payload;
    },
    setViewerPlace: (state, action: PayloadAction<StoredPlace>) => {
      state.place = action.payload;
    },
    setViewerRoute: (state, action: PayloadAction<StoredRoute>) => {
      state.route = action.payload;
    }
  }
});

export const {
  setViewerDirec,
  setViewerPlace,
  setViewerRoute
} = viewerSlice.actions;

export default viewerSlice.reducer;
