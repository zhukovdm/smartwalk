import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import type {
  ExtendedPlace,
  KeywordAdviceItem
} from "../domain/types";
import {
  Map as IMap,
  Storage as IStorage
} from "../domain/interfaces";
import DeviceStorage from "../utils/deviceStorage";

export type AppContextValue = {
  map?: IMap;
  storage: IStorage;
  smart: {
    entityPlaces: Map<string, ExtendedPlace>;
    adviceKeywords: Map<string, KeywordAdviceItem[]>;
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
  smart: {
    entityPlaces: new Map(),
    adviceKeywords: new Map()
  }
};
