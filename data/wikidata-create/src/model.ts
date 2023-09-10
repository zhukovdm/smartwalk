import { Collection, MongoClient } from "mongodb";
import Logger from "./logger";

export default class Model {

  private totalCreated = 0;
  private readonly client: MongoClient;
  private readonly collection: Collection;

  constructor(conn: string) {
    this.client = new MongoClient(conn);
    this.collection = this.client.db("smartwalk").collection("place");
  }

  public async create(logger: Logger, items: Item[]): Promise<void> {
    let batchCreated = 0;

    for (const { location, wikidata } of items) {
      try {
        if (!await this.collection.findOne({ "linked.wikidata": wikidata })) {
          await this.collection.insertOne({
            name: "Noname",
            keywords: [],
            location: location,
            attributes: {},
            linked: {
              wikidata: wikidata
            }
          }, { ignoreUndefined: true });
          ++batchCreated;
        }
      }
      catch (ex) { logger.logFailedCreate(wikidata, ex); }
    }
    this.totalCreated += batchCreated;
    logger.logItemsCreated(batchCreated, this.totalCreated);
  }

  public async dispose(): Promise<void> { this.client.close(); }
}
