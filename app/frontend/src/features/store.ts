import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "./panelSlice";
import searchDirecsReducer from "./searchDirecsSlice";
import searchPlacesReducer from "./searchPlacesSlice";
import searchRoutesReducer from "./searchRoutesSlice";
import resultDirecsReducer from "./resultDirecsSlice";
import resultPlacesReducer from "./resultPlacesSlice";
import resultRoutesReducer from "./resultRoutesSlice";
import favoritesReducer from "./favoritesSlice";
import viewerReducer from "./viewerSlice";
import entityReducer from "./entitySlice";
import sessionReducer from "./sessionSlice";
import solidReducer from "./solidSlice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    searchDirecs: searchDirecsReducer,
    searchPlaces: searchPlacesReducer,
    searchRoutes: searchRoutesReducer,
    resultDirecs: resultDirecsReducer,
    resultPlaces: resultPlacesReducer,
    resultRoutes: resultRoutesReducer,
    favorites: favoritesReducer,
    viewer: viewerReducer,
    entity: entityReducer,
    session: sessionReducer,
    solid: solidReducer,
  }
});

export type StoreDispatch = () => typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;
