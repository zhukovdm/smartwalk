import { IStorage } from "../domain/interfaces";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";
import InmemStorage from "./inmemStorage";
import StorageErrorGenerator from "./storageErrorGenerator";

/**
 * Wrapper over standard IndexedDB.
 */
export default class LocalStorage implements IStorage {

  private static db = "grainpath";

  private static places = "places";
  private static routes = "routes";
  private static direcs = "direcs";

  private static getDb(e: Event) { return (e.target as IDBOpenDBRequest).result; }

  private mock?: IStorage = undefined;

  constructor() {
    const request = indexedDB.open(LocalStorage.db);
    request.onupgradeneeded = function (e) {
      const db = (e.target as IDBOpenDBRequest).result;
      db.createObjectStore(LocalStorage.places, { keyPath: "placeId" });
      db.createObjectStore(LocalStorage.routes, { keyPath: "routeId" });
      db.createObjectStore(LocalStorage.direcs, { keyPath: "direcId" });
    }
    request.onerror = () => { this.mock = new InmemStorage(); }
  }

  public inmem(): boolean { return !!this.mock; }

  public local(): boolean { return !this.mock; }

  public remote(): boolean { return false; }

  // [C]reate

  private static createT<T>(store: string, item: T): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .add(item);
        r2.onsuccess = () => { res(); };
        r2.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorCreate()); };
      };
      r1.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorOpen()); };
    });
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return this.mock?.createPlace(place)
      ?? LocalStorage.createT(LocalStorage.places, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return this.mock?.createRoute(route)
      ?? LocalStorage.createT(LocalStorage.routes, route);
  }

  public createDirec(direc: StoredDirec): Promise<void> {
    return this.mock?.createDirec(direc)
      ?? LocalStorage.createT(LocalStorage.direcs, direc);
  }

  // [R]ead All

  private static getAllT<T>(store: string): Promise<T[]> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store)
          .objectStore(store)
          .getAll();
        r2.onsuccess = (e) => { res((e.target as IDBRequest<T[]>).result); };
        r2.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorGetAll(store)); };
      };
      r1.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorOpen()); }
    });
  }

  public getAllPlaces(): Promise<StoredPlace[]> {
    return this.mock?.getAllPlaces()
      ?? LocalStorage.getAllT(LocalStorage.places);
  }

  public getAllRoutes(): Promise<StoredRoute[]> {
    return this.mock?.getAllRoutes()
      ?? LocalStorage.getAllT(LocalStorage.routes);
  }

  public getAllDirecs(): Promise<StoredDirec[]> {
    return this.mock?.getAllDirecs()
      ?? LocalStorage.getAllT(LocalStorage.direcs);
  }

  // [U]pdate

  private updateT<T>(store: string, item: T): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .put(item)
        r2.onsuccess = () => { res(); };
        r2.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorUpdate()); };
      }
      r1.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorOpen()); };
    });
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.mock?.updatePlace(place)
      ?? this.updateT(LocalStorage.places, place);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.mock?.updateRoute(route)
      ?? this.updateT(LocalStorage.routes, route);
  }

  public updateDirec(direc: StoredDirec): Promise<void> {
    return this.mock?.updateDirec(direc)
      ?? this.updateT(LocalStorage.direcs, direc);
  }

  // [D]elete

  private deleteT(store: string, itemId: string): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .delete(itemId)
        r2.onsuccess = () => { res(); };
        r2.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorDelete()); };
      }
      r1.onerror = () => { rej(StorageErrorGenerator.generateLocalErrorOpen()); };
    });
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.mock?.deletePlace(placeId)
      ?? this.deleteT(LocalStorage.places, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.mock?.deleteRoute(routeId)
      ?? this.deleteT(LocalStorage.routes, routeId);
  }

  public deleteDirec(direcId: string): Promise<void> {
    return this.mock?.deleteDirec(direcId)
      ?? this.deleteT(LocalStorage.direcs, direcId);
  }
}
