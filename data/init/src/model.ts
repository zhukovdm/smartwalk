import { MongoClient } from "mongodb";

export default class Model {

  private readonly client: MongoClient;
  private readonly databaseName = "smartwalk";
  private readonly collectionName = "place";

  constructor(conn: string) {
    this.client = new MongoClient(conn);
  }

  public dropDatabase(): Promise<boolean> {
    return this.client.db(this.databaseName).dropDatabase();
  }

  public async createDatabase(): Promise<void> {
    const coll = this.client.db(this.databaseName)
      .collection(this.collectionName);

    await coll.createIndex({ "linked.osm": 1 });
    await coll.createIndex({ "linked.wikidata": 1 });
    await coll.createIndex({ "location": "2dsphere" });
  }

  /**
   * Release allocated resources gracefully.
   */
  public async dispose(): Promise<void> { this.client.close(); }
}
