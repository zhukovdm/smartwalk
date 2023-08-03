import { IStorage } from "../domain/interfaces";
import { StoredDirec, StoredPlace, StoredRoute } from "../domain/types";

/**
 * Wrapper over standard (k, v) collection.
 */
export default class InmemStorage implements IStorage {

  private readonly places = new Map<string, StoredPlace>();
  private readonly routes = new Map<string, StoredRoute>();
  private readonly direcs = new Map<string, StoredDirec>();

  public inmem(): boolean { return true;  }

  public local(): boolean { return false; }

  public remote(): boolean { return false; }

  // [C]reate

  private createT<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return this.createT(this.places, place.placeId, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return this.createT(this.routes, route.routeId, route);
  }

  public createDirec(direc: StoredDirec): Promise<void> {
    return this.createT(this.direcs, direc.direcId, direc);
  }

  // [R]ead

  public getAllT<T>(store: Map<string, T>): Promise<T[]> {
    return new Promise((res, _) => { res(Array.from(store.values())); })
  }

  public getAllPlaces(): Promise<StoredPlace[]> {
    return this.getAllT(this.places);
  }

  public getAllRoutes(): Promise<StoredRoute[]> {
    return this.getAllT(this.routes);
  }

  public getAllDirecs(): Promise<StoredDirec[]> {
    return this.getAllT(this.direcs);
  }

  // [U]pdate

  private updateT<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.updateT(this.places, place.placeId, place);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.updateT(this.routes, route.routeId, route);
  }

  public updateDirec(direc: StoredDirec): Promise<void> {
    return this.updateT(this.direcs, direc.direcId, direc);
  }

  // [D]elete

  public deleteT<T>(store: Map<string, T>, key: string): Promise<void> {
    return new Promise((res, _) => { store.delete(key); res(); });
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.deleteT(this.places, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.deleteT(this.routes, routeId);
  }

  public deleteDirec(direcId: string): Promise<void> {
    return this.deleteT(this.direcs, direcId);
  }
}
