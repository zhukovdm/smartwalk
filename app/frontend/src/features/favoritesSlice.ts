import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { deleteItemImmutable, updateItemImmutable } from "./immutable";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute,
  WgsPoint
} from "../domain/types";

type FavoritesState = {
  name: string;
  location?: WgsPoint;
  direcs: StoredDirec[];
  direcsLoaded: boolean;
  places: StoredPlace[];
  placesLoaded: boolean;
  routes: StoredRoute[];
  routesLoaded: boolean;
};

const initialState = (): FavoritesState => ({
  name: "",
  direcs: [],
  direcsLoaded: false,
  places: [],
  placesLoaded: false,
  routes: [],
  routesLoaded: false
});

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialState(),
  reducers: {

    resetFavorites: () => initialState(),

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

    // direcs

    setFavoriteDirecs: (state, action: PayloadAction<StoredDirec[]>) => {
      state.direcs = action.payload;
    },
    setFavoriteDirecsLoaded: (state) => {
      state.direcsLoaded = true;
    },
    createFavoriteDirec: (state, action: PayloadAction<StoredDirec>) => {
      state.direcs.push(action.payload);
    },
    updateFavoriteDirec: (state, action: PayloadAction<{ direc: StoredDirec, index: number }>) => {
      const { direc, index } = action.payload;
      state.direcs = updateItemImmutable(state.direcs, direc, index);
    },
    deleteFavoriteDirec: (state, action: PayloadAction<number>) => {
      state.direcs = deleteItemImmutable(state.direcs, action.payload);
    },

    // places

    setFavoritePlaces: (state, action: PayloadAction<StoredPlace[]>) => {
      state.places = action.payload;
    },
    setFavoritePlacesLoaded: (state) => {
      state.placesLoaded = true;
    },
    createFavoritePlace: (state, action: PayloadAction<StoredPlace>) => {
      state.places.push(action.payload);
    },
    updateFavoritePlace: (state, action: PayloadAction<{ place: StoredPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.places = updateItemImmutable(state.places, place, index);
    },
    deleteFavoritePlace: (state, action: PayloadAction<number>) => {
      state.places = deleteItemImmutable(state.places, action.payload);
    },

    // routes

    setFavoriteRoutes: (state, action: PayloadAction<StoredRoute[]>) => {
      state.routes = action.payload;
    },
    setFavoriteRoutesLoaded: (state) => {
      state.routesLoaded = true;
    },
    createFavoriteRoute: (state, action: PayloadAction<StoredRoute>) => {
      state.routes.push(action.payload);
    },
    updateFavoriteRoute: (state, action: PayloadAction<{ route: StoredRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.routes = updateItemImmutable(state.routes, route, index);
    },
    deleteFavoriteRoute: (state, action: PayloadAction<number>) => {
      state.routes = deleteItemImmutable(state.routes, action.payload);
    }
  }
});

export const {

  resetFavorites,

  // custom

  setFavoriteCustomName,
  setFavoriteCustomLocation,
  resetFavoriteCustom,
  deleteFavoriteCustomLocation,

  // direcs

  setFavoriteDirecs,
  setFavoriteDirecsLoaded,
  createFavoriteDirec,
  updateFavoriteDirec,
  deleteFavoriteDirec,

  // places

  setFavoritePlaces,
  setFavoritePlacesLoaded,
  createFavoritePlace,
  updateFavoritePlace,
  deleteFavoritePlace,

  // routes

  setFavoriteRoutes,
  setFavoriteRoutesLoaded,
  createFavoriteRoute,
  updateFavoriteRoute,
  deleteFavoriteRoute,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
