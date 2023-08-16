import {
  StoredDirec,
  StoredPlace,
  StoredRoute,
  UiPlace,
  WgsPoint
} from "./types";

export interface IPin {

  /**
   * Calls `drag` on a new position.
   */
  withDrag(drag: (point: WgsPoint) => void): IPin;

  /**
   * Clear shapes and draw new circle.
   * @param map Currently used map.
   * @param radius (in meters!)
   */
  withCirc(map: IMap, radius: number): IPin;
}

export interface IMap {

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
   * place should be created in a map.
   */
  flyTo(place: UiPlace): void;

  /**
   * Pins of this kind are always non-draggable.
   * @param place describe an object stored in an IStorage.
   */
  addStored(place: UiPlace): IPin;

  /**
   * Places from the server unknown to the user have potential
   * to become stored.
   */
  addTagged(place: UiPlace): IPin;

  /**
   * Custom pins in @b Navigate tab are all draggable. But the very same pins
   * are non-draggable in the result, because attached to a constructed path.
   * @param place describe an object.
   * @param draggable draggability of a pin.
   */
  addCustom(place: UiPlace, draggable: boolean): IPin;

  /**
   * Anything that has a location.
   */
  addSource(place: UiPlace, draggable: boolean): IPin;

  /**
   * Anything that has a location.
   */
  addTarget(place: UiPlace, draggable: boolean): IPin;

  /**
   * @param center User-defined center of a circle.
   * @param radius Radius of a circle (in meters!).
   */
  drawCircle(center: WgsPoint, radius: number): void;

  /**
   * @param polygon Closed sequence of points with at least 4 items (first and last must be the same).
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
 * Standard operations over an arbitrary object storage.
 */
export interface IStorage {

  /** In-memory storage. */
  mem(): boolean;

  /** Data are persisted locally. */
  loc(): boolean;

  /** Remote storage, such as Solid. */
  rem(): boolean;

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
