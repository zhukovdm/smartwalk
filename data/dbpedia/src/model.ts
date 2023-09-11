import { Collection, MongoClient } from "mongodb";
import Logger from "./logger";

export default class Model {

  private totalEnriched = 0;
  private readonly client: MongoClient;
  private readonly collection: Collection;

  constructor(conn: string) {
    this.client = new MongoClient(conn);
    this.collection = this.client.db("smartwalk").collection("place");
  }

  public async getPayload(): Promise<string[]> {
    const target = "linked.wikidata";

    const payload = await this.collection
      .find({ [target]: { $exists: true } })
      .project({ [target]: 1 })
      .toArray();

    return payload.map((doc) => `wd:${doc.linked.wikidata}`) as string[];
  }

  public async enrich(logger: Logger, objs: any[]): Promise<void> {
    const batchEnriched = this.totalEnriched;

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
        ++this.totalEnriched;
      }
      catch (ex) {
        logger.logFailedEnrich(obj.wikidata, ex);
      }
    }

    logger.logItemsEnriched(this.totalEnriched - batchEnriched, this.totalEnriched);
  }

  public async dispose(): Promise<void> { this.client.close(); }
}
