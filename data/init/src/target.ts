import { MongoClient } from "mongodb";
import Logger from "./logger.js";

const DATABASE_NAME = "smartwalk";
const COLLECTION_NAME = "places";

export default class Target {

  private readonly logger: Logger;
  private readonly client: MongoClient;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;
    this.client = new MongoClient(conn);
  }

  async dropDatabase(): Promise<void> {
    try {
      await this.client.db(DATABASE_NAME).dropDatabase();
    } catch (ex) { this.logger.reportError(ex); }
  }

  async createDatabase(): Promise<void> {
    const coll = this.client.db(DATABASE_NAME).collection(COLLECTION_NAME);

    await coll.createIndex({ "linked.osm": 1 });
    await coll.createIndex({ "linked.wikidata": 1 });
    await coll.createIndex({ "location": "2dsphere" });
  }

  /**
   * Release allocated resources gracefully.
   */
  async dispose(): Promise<void> { this.client.close(); }
}
