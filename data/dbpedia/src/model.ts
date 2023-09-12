import { Collection, MongoClient } from "mongodb";
import Logger from "./logger";

export default class Model {

  private totalEnriched = 0;

  private readonly logger: Logger;
  private readonly client: MongoClient;
  private readonly collection: Collection;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;
    this.client = new MongoClient(conn);
    this.collection = this.client.db("smartwalk").collection("place");
  }

  async getPayload(): Promise<string[]> {
    const target = "linked.wikidata";

    const payload = await this.collection
      .find({ [target]: { $exists: true } })
      .project({ [target]: 1 })
      .toArray();

    this.logger.logPayloadLength(payload.length);
    return payload.map((doc) => `wd:${doc.linked.wikidata}`) as string[];
  }

  async enrich(objs: any[]): Promise<void> {
    let batchEnriched = 0;

    for (const obj of objs) {
      try {
        const filter = {
          "linked.wikidata": {
            $eq: obj.wikidata
          }
        };

        const update: Record<string, any> = {
          $set: {
            "name": obj.name,
            "attributes.description": obj.description,
            "attributes.image": obj.image,
            "attributes.website": obj.website,
            "attributes.year": obj.year,
            "linked.dbpedia": obj.dbpedia,
            "linked.yago": obj.yago
          }
        };

        const options = {
          ignoreUndefined: true
        }

        await this.collection.updateMany(filter, update, options);
        ++batchEnriched;
      }
      catch (ex) {
        this.logger.logFailedEnrich(obj.wikidata, ex);
      }
    }

    this.totalEnriched += batchEnriched;
    this.logger.logItemsEnriched(batchEnriched, this.totalEnriched);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
