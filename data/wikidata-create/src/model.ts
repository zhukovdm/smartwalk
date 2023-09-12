import { Collection, MongoClient } from "mongodb";
import Logger from "./logger";

const DATABASE_NAME = "smartwalk";
const COLLECTION_NAME = "place";

export default class Model {

  private totalCreated = 0;
  private readonly logger: Logger;
  private readonly client: MongoClient;
  private readonly collection: Collection;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;
    this.client = new MongoClient(conn);
    this.collection = this.client.db(DATABASE_NAME).collection(COLLECTION_NAME);
  }

  async create(items: Item[]): Promise<void> {
    let batchCreated = 0;
    this.logger.logCreatingObjects();

    for (const { location, wikidata } of items) {
      try {
        if (!(await this.collection.findOne({ "linked.wikidata": wikidata }))) {
          const obj = {
            name: "Noname",
            keywords: [],
            location: location,
            attributes: {},
            linked: {
              wikidata: wikidata
            }
          };

          const options = {
            ignoreUndefined: true
          };

          await this.collection.insertOne(obj, options);
          ++batchCreated;
        }
      }
      catch (ex) {
        this.logger.logFailedCreate(wikidata, ex);
      }
    }

    this.totalCreated += batchCreated;
    this.logger.logItemsCreated(batchCreated, this.totalCreated);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
