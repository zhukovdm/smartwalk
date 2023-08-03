export type StorageAction = "create" | "read" | "update" | "delete";

/**
 * Storage-specific error generator.
 */
export default class StorageErrorGenerator {

  // Local storage

  private static generateLocalError(msg: string) {
    return new Error(`[DB error] ${msg}`);
  }

  public static generateLocalErrorOpen() {
    return this.generateLocalError("Cannot open database.");
  }

  public static generateLocalErrorCreate() {
    return this.generateLocalError("Cannot create an object.");
  }

  public static generateLocalErrorGetAll(what: string) {
    return this.generateLocalError(`Cannot get all ${what}.`);
  }

  public static generateLocalErrorUpdate() {
    return this.generateLocalError("Cannot update object.");
  }

  public static generateLocalErrorDelete() {
    return this.generateLocalError("Cannot delete object.");
  }

  // Solid storage

  private static generateSolidError(msg: string) {
    return new Error(`[Solid error] ${msg}`);
  }

  public static generateSolidErrorX(url: string, action: StorageAction) {
    return this.generateSolidError(`Cannot ${action} an object at ${url}.`);
  }

  public static generateSolidErrorPods() {
    return this.generateSolidError(`Cannot get a list of available pods.`);
  }

  public static generateSolidErrorCont(url: string) {
    return this.generateSolidError(`Cannot ensure a container at ${url}.`);
  }

  public static generateSolidErrorList(url: string, what: string) {
    return this.generateSolidError(`Cannot get list of ${what} at ${url}.`);
  }
}
