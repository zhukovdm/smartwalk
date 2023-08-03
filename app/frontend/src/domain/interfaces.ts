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
 * Wraps CRUD operations over an arbitrary object storage.
 */
export interface IStorage {

  /** In-memory storage. */
  inmem(): boolean;

  /** Data are persisted locally. */
  local(): boolean;

  /** Remote storage, such as Solid. */
  remote(): boolean;

  // [C]reate

  createPlace(place: StoredPlace): Promise<void>;

  createRoute(route: StoredRoute): Promise<void>;

  createDirec(direc: StoredDirec): Promise<void>;

  // [R]ead

  getAllPlaces(): Promise<StoredPlace[]>;

  getAllRoutes(): Promise<StoredRoute[]>;

  getAllDirecs(): Promise<StoredDirec[]>;

  // [U]pdate

  updatePlace(place: StoredPlace): Promise<void>;

  updateRoute(route: StoredRoute): Promise<void>;

  updateDirec(direc: StoredDirec): Promise<void>;

  // [D]elete

  deletePlace(placeId: string): Promise<void>;

  deleteRoute(routeId: string): Promise<void>;

  deleteDirec(direcId: string): Promise<void>;
}
