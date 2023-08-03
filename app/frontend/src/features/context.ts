import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import { Entity, KeywordAutoc } from "../domain/types";
import { IMap, IStorage } from "../domain/interfaces";
import LocalStorage from "../utils/localStorage";

type AppContextValue = {
  map?: IMap;
  storage: IStorage;
  grain: {
    autocs: Map<string, KeywordAutoc[]>;
    entity: Map<string, Entity>;
  }
};

export class MapFactory {

  /**
   * @param map original Leaflet Map.
   * @returns wrapper with desired functionality.
   */
  static getMap(map: LeafletRawMap): IMap { return new LeafletMap(map); }
}

/**
 * Use application context for all non-serializable data!
 */
export const context: AppContextValue = {
  storage: new LocalStorage(),
  grain: {
    autocs: new Map(),
    entity: new Map()
  }
};
