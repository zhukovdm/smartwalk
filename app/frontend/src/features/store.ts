import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "./panelSlice";
import solidReducer from "./solidSlice";
import entityReducer from "./entitySlice";
import sessionReducer from "./sessionSlice";
import favouritesReducer from "./favouritesSlice";
import searchDirecsReducer from "./searchDirecsSlice";
import searchPlacesReducer from "./searchPlacesSlice";
import searchRoutesReducer from "./searchRoutesSlice";
import resultDirecsReducer from "./resultDirecsSlice";
import resultPlacesReducer from "./resultPlacesSlice";
import resultRoutesReducer from "./resultRoutesSlice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    solid: solidReducer,
    entity: entityReducer,
    session: sessionReducer,
    favourites: favouritesReducer,
    searchDirecs: searchDirecsReducer,
    searchPlaces: searchPlacesReducer,
    searchRoutes: searchRoutesReducer,
    resultDirecs: resultDirecsReducer,
    resultPlaces: resultPlacesReducer,
    resultRoutes: resultRoutesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
