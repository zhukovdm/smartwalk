import { Collection, MongoClient } from "mongodb";
import {
  getDateTime
} from "../../shared/dist/src/index.js";
import Logger from "./logger.js";

const DATABASE_NAME = "smartwalk";
const COLLECTION_NAME = "places";

export default class Target {

  private readonly logger: Logger;
  private readonly client: MongoClient;
  private readonly collection: Collection;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;
    this.client = new MongoClient(conn);
    this.collection = this.client.db(DATABASE_NAME).collection(COLLECTION_NAME);
  }

  async load(items: Item[]): Promise<void> {
    let updated = 0;
    let created = 0;
    this.logger.logWritingObjects();

    const options = { ignoreUndefined: true };

    for (const { location, wikidata, osm } of items) {
      try {
        const time = getDateTime();

        // update existing (do nothing, add missing wikidata, or fix wrong one)

        if (!!osm && !!(await this.collection.findOne({ "linked.osm": osm }))) {
          const filter = {
            "linked.osm": { $eq: osm }
          };
          const update: Record<string, any> = {
            $set: {
              "linked.wikidata": wikidata,
              "metadata.updated": time,
            }
          };
          await this.collection.updateMany(filter, update, options);
          ++updated;
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
            },
            metadata: {
              created: time,
              updated: time
            }
          };

          await this.collection.insertOne(create, options);
          ++created;
        }
      }
      catch (ex) {
        this.logger.logFailedWrite(wikidata, ex);
      }
    }

    this.logger.logItemsWritten(updated, created);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
