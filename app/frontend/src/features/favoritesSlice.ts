import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  deleteItemImmutable,
  updateItemImmutable
} from "./immutable";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute,
  WgsPoint
} from "../domain/types";

const compareDirecs = (l: StoredDirec, r: StoredDirec) => l.name.localeCompare(r.name);

const comparePlaces = (l: StoredPlace, r: StoredPlace) => l.name.localeCompare(r.name);

const compareRoutes = (l: StoredRoute, r: StoredRoute) => l.name.localeCompare(r.name);

type FavoritesState = {
  loaded: boolean;
  name: string;
  location?: WgsPoint;
  createExpanded: boolean;
  direcs: StoredDirec[];
  direcsExpanded: boolean;
  places: StoredPlace[];
  placesExpanded: boolean;
  routes: StoredRoute[];
  routesExpanded: boolean;
};

export const initialFavoritesState = (): FavoritesState => ({
  loaded: false,
  name: "",
  createExpanded: false,
  direcs: [],
  direcsExpanded: true,
  places: [],
  placesExpanded: true,
  routes: [],
  routesExpanded: true
});

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavoritesState(),
  reducers: {

    resetFavorites: () => initialFavoritesState(),

    setFavoritesLoaded: (state) => {
      state.loaded = true;
    },

    // custom place

    setFavoriteCustomName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setFavoriteCustomLocation: (state, action: PayloadAction<WgsPoint>) => {
      state.location = action.payload;
    },
    resetFavoriteCustom: (state) => {
      state.name = "";
      state.location = undefined;
    },
    deleteFavoriteCustomLocation: (state) => {
      state.location = undefined;
    },
    toggleFavoriteCreateExpanded: (state) => {
      state.createExpanded = !state.createExpanded;
    },

    // direcs

    setFavoriteDirecs: (state, action: PayloadAction<StoredDirec[]>) => {
      state.direcs = action.payload.sort(compareDirecs);
    },
    createFavoriteDirec: (state, action: PayloadAction<StoredDirec>) => {
      state.direcs = [...state.direcs, action.payload].sort(compareDirecs);
    },
    updateFavoriteDirec: (state, action: PayloadAction<{ direc: StoredDirec, index: number }>) => {
      const { direc, index } = action.payload;
      state.direcs = updateItemImmutable(state.direcs, direc, index).sort(compareDirecs);
    },
    deleteFavoriteDirec: (state, action: PayloadAction<number>) => {
      state.direcs = deleteItemImmutable(state.direcs, action.payload);
    },
    toggleFavoriteDirecsExpanded: (state) => {
      state.direcsExpanded = !state.direcsExpanded;
    },

    // places

    setFavoritePlaces: (state, action: PayloadAction<StoredPlace[]>) => {
      state.places = action.payload.sort(comparePlaces);
    },
    createFavoritePlace: (state, action: PayloadAction<StoredPlace>) => {
      state.places = [...state.places, action.payload].sort(comparePlaces);
    },
    updateFavoritePlace: (state, action: PayloadAction<{ place: StoredPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.places = updateItemImmutable(state.places, place, index).sort(comparePlaces);
    },
    deleteFavoritePlace: (state, action: PayloadAction<number>) => {
      state.places = deleteItemImmutable(state.places, action.payload);
    },
    toggleFavoritePlacesExpanded: (state) => {
      state.placesExpanded = !state.placesExpanded;
    },

    // routes

    setFavoriteRoutes: (state, action: PayloadAction<StoredRoute[]>) => {
      state.routes = action.payload.sort(compareRoutes);
    },
    createFavoriteRoute: (state, action: PayloadAction<StoredRoute>) => {
      state.routes = [...state.routes, action.payload].sort(compareRoutes);
    },
    updateFavoriteRoute: (state, action: PayloadAction<{ route: StoredRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.routes = updateItemImmutable(state.routes, route, index).sort(compareRoutes);
    },
    deleteFavoriteRoute: (state, action: PayloadAction<number>) => {
      state.routes = deleteItemImmutable(state.routes, action.payload);
    },
    toggleFavoriteRoutesExpanded: (state) => {
      state.routesExpanded = !state.routesExpanded;
    }
  }
});

export const {

  resetFavorites,
  setFavoritesLoaded,

  // custom

  setFavoriteCustomName,
  setFavoriteCustomLocation,
  resetFavoriteCustom,
  deleteFavoriteCustomLocation,
  toggleFavoriteCreateExpanded,

  // direcs

  setFavoriteDirecs,
  createFavoriteDirec,
  updateFavoriteDirec,
  deleteFavoriteDirec,
  toggleFavoriteDirecsExpanded,

  // places

  setFavoritePlaces,
  createFavoritePlace,
  updateFavoritePlace,
  deleteFavoritePlace,
  toggleFavoritePlacesExpanded,

  // routes

  setFavoriteRoutes,
  createFavoriteRoute,
  updateFavoriteRoute,
  deleteFavoriteRoute,
  toggleFavoriteRoutesExpanded
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
