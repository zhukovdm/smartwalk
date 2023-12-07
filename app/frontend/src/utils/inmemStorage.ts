import {
  Storage as IStorage,
  StorageKind
} from "../domain/interfaces";
import type {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";

/**
 * Storage wrapper over standard kv-collection.
 */
export default class InmemStorage implements IStorage {

  private readonly direcStore = new Map<string, StoredDirec>();
  private readonly placeStore = new Map<string, StoredPlace>();
  private readonly routeStore = new Map<string, StoredRoute>();

  public kind(): StorageKind {
    return StorageKind.InMem;
  }

  public init(): Promise<void> {
    return Promise.resolve();
  }

  // create

  private createT<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return this.createT(this.placeStore, place.placeId, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return this.createT(this.routeStore, route.routeId, route);
  }

  public createDirec(direc: StoredDirec): Promise<void> {
    return this.createT(this.direcStore, direc.direcId, direc);
  }

  // get identifiers

  private getTIdentifiers<T>(store: Map<string, T>): Promise<string[]> {
    return Promise.resolve(Array.from(store.keys()));
  }

  public getDirecIdentifiers(): Promise<string[]> {
    return this.getTIdentifiers(this.direcStore);
  }

  public getPlaceIdentifiers(): Promise<string[]> {
    return this.getTIdentifiers(this.placeStore);
  }

  public getRouteIdentifiers(): Promise<string[]> {
    return this.getTIdentifiers(this.routeStore);
  }

  // get by identifier

  public getT<T>(store: Map<string, T>, key: string): Promise<T | undefined> {
    return Promise.resolve(store.get(key));
  }

  public getDirec(direcId: string): Promise<StoredDirec | undefined> {
    return this.getT(this.direcStore, direcId);
  }

  public getPlace(placeId: string): Promise<StoredPlace | undefined> {
    return this.getT(this.placeStore, placeId);
  }

  public getRoute(routeId: string): Promise<StoredRoute | undefined> {
    return this.getT(this.routeStore, routeId);
  }

  // update

  private updateT<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public updateDirec(direc: StoredDirec): Promise<void> {
    return this.updateT(this.direcStore, direc.direcId, direc);
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.updateT(this.placeStore, place.placeId, place);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.updateT(this.routeStore, route.routeId, route);
  }

  // delete

  public deleteT<T>(store: Map<string, T>, key: string): Promise<void> {
    return new Promise((res, _) => { store.delete(key); res(); });
  }

  public deleteDirec(direcId: string): Promise<void> {
    return this.deleteT(this.direcStore, direcId);
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.deleteT(this.placeStore, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.deleteT(this.routeStore, routeId);
  }
}
