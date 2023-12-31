import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";
import { updateItemImmutable } from "../utils/functions";

type ViewerStateType = {
  direc?: StoredDirec;
  place?: StoredPlace;
  route?: StoredRoute;
  routeFilters: boolean[];
};

export const initialViewerState = (): ViewerStateType => ({
  routeFilters: []
});

export const viewerSlice = createSlice({
  name: "viewer",
  initialState: initialViewerState(),
  reducers: {
    setViewerDirec: (state, action: PayloadAction<StoredDirec>) => {
      state.direc = action.payload;
    },
    setViewerPlace: (state, action: PayloadAction<StoredPlace>) => {
      state.place = action.payload;
    },
    setViewerRoute: (state, action: PayloadAction<StoredRoute>) => {
      const r = action.payload;
      state.route = r;
      state.routeFilters = r.categories.map(() => true);
    },
    toggleViewerRouteFilter: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.routeFilters = updateItemImmutable(state.routeFilters, !state.routeFilters[i], i);
    }
  }
});

export const {
  setViewerDirec,
  setViewerPlace,
  setViewerRoute,
  toggleViewerRouteFilter
} = viewerSlice.actions;

export default viewerSlice.reducer;
