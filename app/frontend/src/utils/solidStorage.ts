import {
  createContainerAt,
  deleteFile,
  getFile,
  getSolidDataset,
  getThing,
  getUrlAll,
  overwriteFile
} from "@inrupt/solid-client";
import {
  fetch,
  getDefaultSession
} from "@inrupt/solid-client-authn-browser";
import namespace from "@rdfjs/namespace";
import {
  StoredPlace,
  StoredRoute,
  StoredDirec
} from "../domain/types";
import { IStorage } from "../domain/interfaces";
import StorageErrorGenerator from "./storageErrorGenerator";

const ns = {
  ldp: namespace("http://www.w3.org/ns/ldp#")
};

/**
 * Wrapper over decentralized Solid Pod.
 */
export default class SolidStorage implements IStorage {

  // HTTP

  private static readonly content = "application/json";

  // URL

  private static readonly dir = "grainpath/";

  private static readonly places = "places/";
  private static readonly routes = "routes/";
  private static readonly direcs = "direcs/";

  private readonly storage: string;

  private getDir(what: string): string {
    return `${this.storage}${SolidStorage.dir}${what}`;
  }

  private getPlacesDir(): string { return this.getDir(SolidStorage.places); }

  private getRoutesDir(): string { return this.getDir(SolidStorage.routes); }

  private getDirecsDir(): string { return this.getDir(SolidStorage.direcs); }

  // Init

  constructor(storage: string) { this.storage = storage; }

  public inmem(): boolean { return false; }

  public local(): boolean { return false; }

  public remote(): boolean { return true; }

  /**
   * Initialize storage:
   * 
   *  - ensure containers exist.
   */
  public async init(): Promise<SolidStorage> {
    const dirs = [this.getPlacesDir(), this.getRoutesDir(), this.getDirecsDir()];
    for (const dir of dirs) {
      try {
        await getSolidDataset(dir, { fetch: fetch });
      }
      catch {
        try {
          await createContainerAt(dir, { fetch: fetch });
        }
        catch (ex) {
          console.log(ex);
          throw StorageErrorGenerator.generateSolidErrorCont(dir);
        }
      }
    }
    return this;
  }

  // List

  public async getList(url: string, what: string): Promise<string[]> {
    try {
      const ds = await getSolidDataset(url, { fetch: fetch });
      return getUrlAll(getThing(ds, url)!, ns.ldp.contains);
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorList(url, what);
    }
  }

  public async getPlacesList(): Promise<string[]> {
    return this.getList(this.getPlacesDir(), "places");
  }

  public async getRoutesList(): Promise<string[]> {
    return this.getList(this.getRoutesDir(), "routes");
  }

  public async getDirecsList(): Promise<string[]> {
    return this.getList(this.getDirecsDir(), "direcs");
  }

  // Overwrite

  private static async overwriteT<T>(url: string, item: T, action: "create" | "update"): Promise<void> {
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      try {
        await overwriteFile(
          url,
          new Blob([JSON.stringify(item)], { type: SolidStorage.content }),
          { contentType: SolidStorage.content, fetch: fetch }
        )
      }
      catch (ex) {
        console.log(ex);
        throw StorageErrorGenerator.generateSolidErrorX(url, action);
      }
    }
  }

  // [C]reate

  public async createPlace(place: StoredPlace): Promise<void> {
    return SolidStorage.overwriteT(
      `${this.getPlacesDir()}${place.placeId}.json`, place, "create");
  }

  public async createRoute(route: StoredRoute): Promise<void> {
    return SolidStorage.overwriteT(
      `${this.getRoutesDir()}${route.routeId}.json`, route, "create");
  }

  public async createDirec(direc: StoredDirec): Promise<void> {
    return SolidStorage.overwriteT(
      `${this.getDirecsDir()}${direc.direcId}.json`, direc, "create");
  }

  // [R]ead

  public static async readT<T>(url: string): Promise<T> {
    try {
      const blob = await getFile(url, { fetch: fetch });
      return JSON.parse(await blob.text());
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorX(url, "read");
    }
  }

  public async getPlace(placeUrl: string): Promise<StoredPlace> {
    return SolidStorage.readT(placeUrl);
  }

  public async getRoute(routeUrl: string): Promise<StoredRoute> {
    return SolidStorage.readT(routeUrl);
  }

  public async getDirec(direcUrl: string): Promise<StoredDirec> {
    return SolidStorage.readT(direcUrl);
  }

  // [R]ead All, not used!

  public getAllPlaces(): Promise<StoredPlace[]> {
    throw new Error("Method not implemented.");
  }

  public getAllRoutes(): Promise<StoredRoute[]> {
    throw new Error("Method not implemented.");
  }

  public getAllDirecs(): Promise<StoredDirec[]> {
    throw new Error("Method not implemented.");
  }

  // [U]pdate

  public updatePlace(place: StoredPlace): Promise<void> {
    return SolidStorage.overwriteT(
      `${this.getPlacesDir()}${place.placeId}.json`, place, "update");
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return SolidStorage.overwriteT(
      `${this.getRoutesDir()}${route.routeId}.json`, route, "update");
  }

  public updateDirec(direc: StoredDirec): Promise<void> {
    return SolidStorage.overwriteT(
      `${this.getDirecsDir()}${direc.direcId}.json`, direc, "update");
  }

  // [D]elete

  private static async deleteT(url: string): Promise<void> {
    try {
      await deleteFile(url, { fetch: fetch });
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorX(url, "delete");
    }
  }

  public deletePlace(placeId: string): Promise<void> {
    return SolidStorage.deleteT(`${this.getPlacesDir()}${placeId}.json`);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return SolidStorage.deleteT(`${this.getRoutesDir()}${routeId}.json`);
  }

  public deleteDirec(direcId: string): Promise<void> {
    return SolidStorage.deleteT(`${this.getDirecsDir()}${direcId}.json`);
  }
}
