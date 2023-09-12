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
            "attributes.email": obj.email,
            "attributes.phone": obj.phone,
            "attributes.website": obj.website,
            "attributes.capacity": obj.capacity,
            "attributes.elevation": obj.elevation,
            "attributes.minimumAge": obj.minimumAge,
            "attributes.year": obj.year,
            "attributes.address.country": obj.country,
            "attributes.address.place": obj.street,
            "attributes.address.house": obj.house,
            "attributes.address.postalCode": obj.postalCode,
            "attributes.socialNetworks.facebook": obj.facebook,
            "attributes.socialNetworks.instagram": obj.instagram,
            "attributes.socialNetworks.linkedin": obj.linkedin,
            "attributes.socialNetworks.pinterest": obj.pinterest,
            "attributes.socialNetworks.telegram": obj.telegram,
            "attributes.socialNetworks.twitter": obj.twitter,
            "attributes.socialNetworks.youtube": obj.youtube,
            "linked.mapycz": obj.mapycz,
            "linked.geonames": obj.geonames
          },
          $addToSet: {
            "keywords": {
              $each: obj.keywords
            }
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
