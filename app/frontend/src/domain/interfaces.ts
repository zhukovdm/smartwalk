import {
  PlaceCategory,
  StoredDirec,
  StoredPlace,
  StoredRoute,
  UiPlace,
  WgsPoint
} from "./types";

export interface Pin {

  /**
   * Calls `drag` on a new position.
   */
  withDrag(drag: (point: WgsPoint) => void): Pin;

  /**
   * Attach circle-drawing functionality.
   * @param map currently used map
   * @param radius in meters!
   */
  withCirc(map: Map, radius: number): Pin;
}

export interface Map {

  /**
   * Delete all existing, user-defined objects from a map.
   */
  clear(): void;

  /**
   * Delete all shapes (circles, polygons, polylines, etc.), markers should
   * be left untouched.
   */
  clearShapes(): void;

  /**
   * Move map center to the place location and open popup. Prior to the flight,
   * the corresponding pin should be created in a map.
   */
  flyTo(place: UiPlace): void;

  /**
   * @param place stored place
   */
  addStored(place: UiPlace, categories: PlaceCategory[]): Pin;

  /**
   * @param place not stored place
   */
  addCommon(place: UiPlace, categories: PlaceCategory[], draggable: boolean): Pin;

  /**
   * @param place starting point of a route in `Routes` form
   */
  addSource(place: UiPlace, categories: PlaceCategory[], draggable: boolean): Pin;

  /**
   * @param place destination of a route in `Routes` form
   */
  addTarget(place: UiPlace, categories: PlaceCategory[], draggable: boolean): Pin;

  /**
   * @param place the center of a circle in `Places` form
   */
  addCenter(place: UiPlace, categories: PlaceCategory[], draggable: boolean): Pin;

  /**
   * @param center Location of the center of a circle.
   * @param radius Radius of a circle (in meters!).
   */
  drawCircle(center: WgsPoint, radius: number): void;

  /**
   * @param polygon Closed sequence of points with at least 4 items (the first and last must be identical).
   */
  drawPolygon(polygon: WgsPoint[]): void;

  /**
   * @param polyline Sequence of points with at least 2 items.
   */
  drawPolyline(polyline: WgsPoint[]): void;

  /**
   * @param callback called with user-clicked position.
   */
  captureLocation(callback: (point: WgsPoint) => void): void;
}

/**
 * Supported kinds of decentralized storage.
 */
export enum StorageKind {
  Device,
  InMem,
  Solid,
};

/**
 * Standard operations over an arbitrary object storage.
 */
export interface Storage {

  /** Storage kind. */
  kind(): StorageKind;

  /** Initialization procedure. */
  init(): Promise<void>;

  // create

  createDirec(direc: StoredDirec): Promise<void>;

  createPlace(place: StoredPlace): Promise<void>;

  createRoute(route: StoredRoute): Promise<void>;

  // get identifiers

  getDirecIdentifiers(): Promise<string[]>;

  getPlaceIdentifiers(): Promise<string[]>;

  getRouteIdentifiers(): Promise<string[]>;

  // get by identifier

  getDirec(direcId: string): Promise<StoredDirec | undefined>;

  getPlace(placeId: string): Promise<StoredPlace | undefined>;

  getRoute(routeId: string): Promise<StoredRoute | undefined>;

  // update

  updateDirec(direc: StoredDirec): Promise<void>;

  updatePlace(place: StoredPlace): Promise<void>;

  updateRoute(route: StoredRoute): Promise<void>;

  // delete

  deleteDirec(direcId: string): Promise<void>;

  deletePlace(placeId: string): Promise<void>;

  deleteRoute(routeId: string): Promise<void>;
}
