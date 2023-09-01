import { v4 as uuidv4 } from "uuid";

/**
 * Generate Id based on a content of a JavaScript entity.
 */
export default class IdGenerator {
  public static generateId(_: any) { return uuidv4(); }
}
