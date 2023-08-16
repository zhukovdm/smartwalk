export type StorageAction = "create" | "get" | "update" | "delete";

/**
 * Storage-specific error generator.
 */
export default class StorageErrorGenerator {

  // Local storage

  private static generateLocalError(msg: string) {
    return new Error(`[Local error] ${msg}`);
  }

  public static generateLocalErrorOpen() {
    return this.generateLocalError("Cannot open database.");
  }

  public static generateLocalErrorAction(action: StorageAction, itemId: string, store: string) {
    return this.generateLocalError(`Cannot ${action} object ${itemId} in store ${store}.`);
  }

  public static generateLocalErrorGetIdentifiers(what: string) {
    return this.generateLocalError(`Cannot get identifiers of all ${what}.`);
  }

  // Solid storage

  private static generateSolidError(msg: string) {
    return new Error(`[Solid error] ${msg}`);
  }

  public static generateSolidErrorPods() {
    return this.generateSolidError(`Cannot get a list of available pods.`);
  }

  public static generateSolidErrorInit(url: string) {
    return this.generateSolidError(`Cannot initialize a container at ${url}.`);
  }

  public static generateSolidErrorAction(action: StorageAction, url: string) {
    return this.generateSolidError(`Cannot ${action} an object at ${url}.`);
  }

  public static generateSolidErrorGetIdentifiers(what: string, url: string) {
    return this.generateSolidError(`Cannot get ${what} identifiers at ${url}.`);
  }
}
