import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import type {
  ExtendedPlace,
  KeywordAdviceItem,
  UiPlace
} from "../domain/types";
import {
  Map as IMap,
  Storage as IStorage
} from "../domain/interfaces";
import DeviceStorage from "../utils/deviceStorage";

export type AppContextValue = {
  map?: IMap;
  storage: IStorage;
  cache: {
    entityPlaces: Map<string, ExtendedPlace>;
    adviceKeywords: Map<string, KeywordAdviceItem[]>;
    searchedPlaces: Map<string, UiPlace[]>;
  }
};

export class MapFactory {

  /**
   * @param map original Leaflet map object
   * @returns wrapper with desired functionality
   */
  static getMap(map?: LeafletRawMap): IMap {
    return new LeafletMap(map);
  }
}

/**
 * Use application context for all non-serializable data!
 */
export const context: AppContextValue = {
  storage: new DeviceStorage(),
  cache: {
    entityPlaces: new Map(),
    adviceKeywords: new Map(),
    searchedPlaces: new Map(),
  }
};
