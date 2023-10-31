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

  async write(items: Item[]): Promise<void> {
    let batchWritten = 0;
    this.logger.logWritingObjects();

    const options = { ignoreUndefined: true };

    for (const { location, wikidata, osm } of items) {
      try {
        // update existing

        if (!!osm && !!(await this.collection.findOne({ "linked.osm": osm }))) {
          const filter = {
            "linked.osm": { $eq: osm }
          };
          const update: Record<string, any> = {
            $set: {
              "linked.wikidata": wikidata
            }
          };
          await this.collection.updateMany(filter, update, options);
          ++batchWritten;
        }

        // or insert non-existent!

        else if (!(await this.collection.findOne({ "linked.wikidata": wikidata }))) {
          const create = {
            name: "Noname",
            keywords: [],
            location: location,
            attributes: {},
            linked: {
              osm: osm,
              wikidata: wikidata
            }
          };

          await this.collection.insertOne(create, options);
          ++batchWritten;
        }
      }
      catch (ex) {
        this.logger.logFailedWrite(wikidata, ex);
      }
    }

    this.totalCreated += batchWritten;
    this.logger.logItemsWritten(batchWritten, this.totalCreated);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
