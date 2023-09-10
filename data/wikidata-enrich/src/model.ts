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

  public async enrich(logger: Logger, items: any[]): Promise<void> {
    const batchEnriched = this.totalEnriched;

    for (const item of items) {
      try {
        const filter = {
          "linked.wikidata": {
            $eq: item.wikidata
          }
        };

        const update: Record<string, any> = {
          $set: {
            "name": item.name,
            "attributes.description": item.description,
            "attributes.image": item.image,
            "attributes.email": item.email,
            "attributes.phone": item.phone,
            "attributes.website": item.website,
            "attributes.capacity": item.capacity,
            "attributes.elevation": item.elevation,
            "attributes.minimumAge": item.minimumAge,
            "attributes.year": item.year,
            "attributes.address.country": item.country,
            "attributes.address.place": item.street,
            "attributes.address.house": item.house,
            "attributes.address.postalCode": item.postalCode,
            "attributes.socialNetworks.facebook": item.facebook,
            "attributes.socialNetworks.instagram": item.instagram,
            "attributes.socialNetworks.linkedin": item.linkedin,
            "attributes.socialNetworks.pinterest": item.pinterest,
            "attributes.socialNetworks.telegram": item.telegram,
            "attributes.socialNetworks.twitter": item.twitter,
            "attributes.socialNetworks.youtube": item.youtube,
            "linked.mapycz": item.mapycz,
            "linked.geonames": item.geonames
          },
          $addToSet: {
            "keywords": {
              $each: item.keywords
            }
          }
        };

        const options = {
          ignoreUndefined: true
        }

        await this.collection.updateMany(filter, update, options);
        ++this.totalEnriched;
      }
      catch (ex) {
        logger.logFailedEnrich(item.wikidata, ex);
      }
    }

    logger.logItemsEnriched(this.totalEnriched - batchEnriched, this.totalEnriched);
  }

  public async dispose(): Promise<void> { this.client.close(); }
}
