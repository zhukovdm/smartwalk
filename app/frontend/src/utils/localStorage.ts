import {
  IStorage,
  StorageKind
} from "../domain/interfaces";
import type {
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

  private static db = "smartwalk";

  private static places = "places";
  private static routes = "routes";
  private static direcs = "direcs";

  private static getDb(e: Event) {
    return (e.target as IDBOpenDBRequest).result;
  }

  private fallback?: IStorage = new InmemStorage();

  public kind(): StorageKind {
    return (!!this.fallback) ? StorageKind.InMem : StorageKind.Device;
  }

  public init(): Promise<void> {
    const request = indexedDB.open(LocalStorage.db);

    request.onupgradeneeded = (evt) => {
      const db = (evt.target as IDBOpenDBRequest).result;
      db.createObjectStore(LocalStorage.direcs, { keyPath: "direcId" });
      db.createObjectStore(LocalStorage.places, { keyPath: "placeId" });
      db.createObjectStore(LocalStorage.routes, { keyPath: "routeId" });
    };

    return new Promise((res, rej) => {
      request.onsuccess = () => {
        this.fallback = undefined; res();
      };
      request.onerror = () => {
        rej();
      };
    });
  }

  // create

  private static createT<T>(store: string, item: T, itemId: string): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(this.db);
      r1.onsuccess = (e) => {
        const r2 = this
          .getDb(e)
          .transaction(store, "readwrite")
          .objectStore(store)
          .add(item);
        r2.onsuccess = () => {
          res();
        };
        r2.onerror = () => {
          rej(StorageErrorGenerator.generateLocalErrorAction("create", itemId, store));
        };
      };
      r1.onerror = () => {
        rej(StorageErrorGenerator.generateLocalErrorOpen());
      };
    });
  }

  public createDirec(direc: StoredDirec): Promise<void> {
    return this.fallback?.createDirec(direc)
      ?? LocalStorage.createT(LocalStorage.direcs, direc, direc.direcId);
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return this.fallback?.createPlace(place)
      ?? LocalStorage.createT(LocalStorage.places, place, place.placeId);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return this.fallback?.createRoute(route)
      ?? LocalStorage.createT(LocalStorage.routes, route, route.routeId);
  }

  // get identifiers

  private static getTIdentifiers(store: string): Promise<string[]> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(this.db);
      r1.onsuccess = (e) => {
        const r2 = this
          .getDb(e)
          .transaction(store)
          .objectStore(store)
          .getAllKeys();
        r2.onsuccess = (e) => {
          res((e.target as IDBRequest<string[]>).result);
        }
        r2.onerror = () => {
          rej(StorageErrorGenerator.generateLocalErrorGetIdentifiers(store));
        }
      };
      r1.onerror = () => {
        rej(StorageErrorGenerator.generateLocalErrorOpen());
      };
    });
  }

  public getDirecIdentifiers(): Promise<string[]> {
    return this.fallback?.getDirecIdentifiers()
      ?? LocalStorage.getTIdentifiers(LocalStorage.direcs);
  }

  public getPlaceIdentifiers(): Promise<string[]> {
    return this.fallback?.getPlaceIdentifiers()
      ?? LocalStorage.getTIdentifiers(LocalStorage.places);
  }

  public getRouteIdentifiers(): Promise<string[]> {
    return this.fallback?.getRouteIdentifiers()
      ?? LocalStorage.getTIdentifiers(LocalStorage.routes);
  }

  // get by identifier

  private static getT<T>(store: string, itemId: string): Promise<T | undefined> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store)
          .objectStore(store)
          .get(itemId);
        r2.onsuccess = (e) => {
          res((e.target as IDBRequest<T | undefined>).result);
        };
        r2.onerror = () => {
          rej(StorageErrorGenerator.generateLocalErrorAction("get", itemId, store));
        };
      };
      r1.onerror = () => {
        rej(StorageErrorGenerator.generateLocalErrorOpen());
      }
    });
  }

  public getDirec(direcId: string): Promise<StoredDirec | undefined> {
    return this.fallback?.getDirec(direcId)
      ?? LocalStorage.getT(LocalStorage.direcs, direcId);
  }

  public getPlace(placeId: string): Promise<StoredPlace | undefined> {
    return this.fallback?.getPlace(placeId)
      ?? LocalStorage.getT(LocalStorage.places, placeId);
  }

  public getRoute(routeId: string): Promise<StoredRoute | undefined> {
    return this.fallback?.getRoute(routeId)
      ?? LocalStorage.getT(LocalStorage.routes, routeId);
  }

  // update

  private static updateT<T>(store: string, item: T, itemId: string): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .put(item)
        r2.onsuccess = () => {
          res();
        };
        r2.onerror = () => {
          rej(StorageErrorGenerator.generateLocalErrorAction("update", itemId, store));
        };
      }
      r1.onerror = () => {
        rej(StorageErrorGenerator.generateLocalErrorOpen());
      };
    });
  }

  public updateDirec(direc: StoredDirec): Promise<void> {
    return this.fallback?.updateDirec(direc)
      ?? LocalStorage.updateT(LocalStorage.direcs, direc, direc.direcId);
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.fallback?.updatePlace(place)
      ?? LocalStorage.updateT(LocalStorage.places, place, place.placeId);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.fallback?.updateRoute(route)
      ?? LocalStorage.updateT(LocalStorage.routes, route, route.routeId);
  }

  // delete

  private static deleteT(store: string, itemId: string): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(LocalStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = LocalStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .delete(itemId)
        r2.onsuccess = () => {
          res();
        };
        r2.onerror = () => {
          rej(StorageErrorGenerator.generateLocalErrorAction("delete", itemId, store));
        };
      }
      r1.onerror = () => {
        rej(StorageErrorGenerator.generateLocalErrorOpen());
      };
    });
  }

  public deleteDirec(direcId: string): Promise<void> {
    return this.fallback?.deleteDirec(direcId)
      ?? LocalStorage.deleteT(LocalStorage.direcs, direcId);
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.fallback?.deletePlace(placeId)
      ?? LocalStorage.deleteT(LocalStorage.places, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.fallback?.deleteRoute(routeId)
      ?? LocalStorage.deleteT(LocalStorage.routes, routeId);
  }
}
