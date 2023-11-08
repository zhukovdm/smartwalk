import {
  createContainerAt,
  deleteFile,
  getFile,
  getSolidDataset,
  getThing,
  getUrlAll,
  overwriteFile
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import namespace from "@rdfjs/namespace";
import {
  IStorage,
  StorageKind
} from "../domain/interfaces";
import type {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";
import StorageErrorGenerator from "./storageErrorGenerator";

const ns = {
  ldp: namespace("http://www.w3.org/ns/ldp#")
};

/**
 * Wrapper over decentralized Solid Pod.
 */
export default class SolidStorage implements IStorage {

  private static readonly EMPTY_STRING = "";

  // http

  private static readonly content = "application/json; charset=utf-8";

  // url

  private static readonly dir = "smartwalk/";

  private static readonly direcs = "direcs/";
  private static readonly places = "places/";
  private static readonly routes = "routes/";

  private readonly storageUrl: string;

  private getDirUrl(what: string): string {
    return `${this.storageUrl}${SolidStorage.dir}${what}`;
  }

  private getDirecsDirUrl(): string {
    return this.getDirUrl(SolidStorage.direcs);
  }

  private getPlacesDirUrl(): string {
    return this.getDirUrl(SolidStorage.places);
  }

  private getRoutesDirUrl(): string {
    return this.getDirUrl(SolidStorage.routes);
  }

  private static getItemUrl(dirUrl: string, itemId: string) {
    return `${dirUrl}${itemId}.json`;
  }

  constructor(storageUrl: string) {
    this.storageUrl = storageUrl;
  }

  public kind(): StorageKind {
    return StorageKind.Solid;
  }

  public async init(): Promise<void> {
    const dirs = [
      this.getDirecsDirUrl(),
      this.getPlacesDirUrl(),
      this.getRoutesDirUrl()
    ];

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
          throw StorageErrorGenerator.generateSolidErrorInit(dir);
        }
      }
    }
  }

  // overwrite

  private static async overwriteT<T>(url: string, item: T, action: "create" | "update"): Promise<void> {
    try {
      await overwriteFile(
        url,
        new Blob([JSON.stringify(item)], { type: SolidStorage.content }),
        { contentType: SolidStorage.content, fetch: fetch }
      )
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorAction(action, url);
    }
  }

  // create

  public createDirec(direc: StoredDirec): Promise<void> {
    return SolidStorage.overwriteT(
      SolidStorage.getItemUrl(this.getDirecsDirUrl(), direc.direcId), direc, "create");
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return SolidStorage.overwriteT(
      SolidStorage.getItemUrl(this.getPlacesDirUrl(), place.placeId), place, "create");
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return SolidStorage.overwriteT(
      SolidStorage.getItemUrl(this.getRoutesDirUrl(), route.routeId), route, "create");
  }

  // get identifiers

  public static async getTIdentifiers(url: string, what: string): Promise<string[]> {
    try {
      const ds = await getSolidDataset(url, { fetch: fetch });
      return getUrlAll(getThing(ds, url)!, ns.ldp.contains)
        .map((absUrl) => absUrl.replace(url, this.EMPTY_STRING).replace(".json", this.EMPTY_STRING));
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorGetIdentifiers(what, url);
    }
  }

  public getDirecIdentifiers(): Promise<string[]> {
    return SolidStorage.getTIdentifiers(this.getDirecsDirUrl(), "direc");
  }

  public getPlaceIdentifiers(): Promise<string[]> {
    return SolidStorage.getTIdentifiers(this.getPlacesDirUrl(), "place");
  }

  public getRouteIdentifiers(): Promise<string[]> {
    return SolidStorage.getTIdentifiers(this.getRoutesDirUrl(), "route");
  }

  // get by identifier

  public static async getT<T>(url: string): Promise<T> {
    try {
      const blob = await getFile(url, { fetch: fetch });
      return JSON.parse(await blob.text());
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorAction("get", url);
    }
  }

  public getDirec(direcId: string): Promise<StoredDirec> {
    return SolidStorage.getT(
      SolidStorage.getItemUrl(this.getDirecsDirUrl(), direcId));
  }

  public getPlace(placeId: string): Promise<StoredPlace> {
    return SolidStorage.getT(
      SolidStorage.getItemUrl(this.getPlacesDirUrl(), placeId));
  }

  public getRoute(routeId: string): Promise<StoredRoute> {
    return SolidStorage.getT(
      SolidStorage.getItemUrl(this.getRoutesDirUrl(), routeId));
  }

  // update

  public updateDirec(direc: StoredDirec): Promise<void> {
    return SolidStorage.overwriteT(
      SolidStorage.getItemUrl(this.getDirecsDirUrl(), direc.direcId), direc, "update");
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return SolidStorage.overwriteT(
      SolidStorage.getItemUrl(this.getPlacesDirUrl(), place.placeId), place, "update");
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return SolidStorage.overwriteT(
      SolidStorage.getItemUrl(this.getRoutesDirUrl(), route.routeId), route, "update");
  }

  // delete

  private static async deleteT(url: string): Promise<void> {
    try {
      await deleteFile(url, { fetch: fetch });
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorAction("delete", url);
    }
  }

  public deleteDirec(direcId: string): Promise<void> {
    return SolidStorage.deleteT(
      SolidStorage.getItemUrl(this.getDirecsDirUrl(), direcId));
  }

  public deletePlace(placeId: string): Promise<void> {
    return SolidStorage.deleteT(
      SolidStorage.getItemUrl(this.getPlacesDirUrl(), placeId));
  }

  public deleteRoute(routeId: string): Promise<void> {
    return SolidStorage.deleteT(
      SolidStorage.getItemUrl(this.getRoutesDirUrl(), routeId));
  }
}
