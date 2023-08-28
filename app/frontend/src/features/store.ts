import {
  PreloadedState,
  combineReducers,
  configureStore
} from "@reduxjs/toolkit";
import entityReducer from "./entitySlice";
import favoritesReducer from "./favoritesSlice";
import panelReducer from "./panelSlice";
import resultDirecsReducer from "./resultDirecsSlice";
import resultPlacesReducer from "./resultPlacesSlice";
import resultRoutesReducer from "./resultRoutesSlice";
import searchDirecsReducer from "./searchDirecsSlice";
import searchPlacesReducer from "./searchPlacesSlice";
import searchRoutesReducer from "./searchRoutesSlice";
import sessionReducer from "./sessionSlice";
import solidReducer from "./solidSlice";
import viewerReducer from "./viewerSlice";

const storeReducer = combineReducers({
  entity: entityReducer,
  favorites: favoritesReducer,
  panel: panelReducer,
  resultDirecs: resultDirecsReducer,
  resultPlaces: resultPlacesReducer,
  resultRoutes: resultRoutesReducer,
  searchDirecs: searchDirecsReducer,
  searchPlaces: searchPlacesReducer,
  searchRoutes: searchRoutesReducer,
  session: sessionReducer,
  solid: solidReducer,
  viewer: viewerReducer
});

export type StoreState = ReturnType<typeof storeReducer>;

export function setupStore(preloadedState?: PreloadedState<StoreState>) {
  return configureStore({ reducer: storeReducer, preloadedState });
}

export const store = setupStore();

export type AppStore = typeof store;
export type StoreDispatch = () => typeof store.dispatch;
