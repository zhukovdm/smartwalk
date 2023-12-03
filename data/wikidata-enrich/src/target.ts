import { Collection, MongoClient } from "mongodb";
import {
  getDateTime,
  getPayloadIter
} from "../../shared/index.js";
import Logger from "./logger.js";

export default class Target {

  private totalEnriched = 0;

  private readonly logger: Logger;
  private readonly client: MongoClient;
  private readonly collection: Collection;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;
    this.client = new MongoClient(conn);
    this.collection = this.client.db("smartwalk").collection("place");
  }

  /**
   * Get all place identifiers in the database.
   * @param window Maximum number of items in one batch.
   * @returns Iterator over a list of identifiers.
   */
  async getPayloadIter(window: number): Promise<{
    [Symbol.iterator](): Generator<string[], void, unknown>;
  }> {
    const target = "linked.wikidata";

    let promise = this.collection
      .find({ [target]: { $exists: true } })
      .project({ [target]: 1 })
      .toArray();

    let payload = (await promise)
      .map((doc) => `wd:${doc.linked.wikidata}`);

    this.logger.logPayloadLength(payload.length);
    return getPayloadIter(payload, window);
  }

  /**
   * Load phase.
   * @param items Well-formed items.
   * @returns Nothing.
   */
  async l(items: any[]): Promise<void> {
    let batchEnriched = 0;

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
            "linked.geonames": item.geonames,
            "metadata.updated": getDateTime()
          },
          $addToSet: { /* eliminate repeated keywords */
            "keywords": {
              $each: item.keywords
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
        this.logger.logFailedEnrich(item.wikidata, ex);
      }
    }

    this.totalEnriched += batchEnriched;
    this.logger.logItemsEnriched(batchEnriched, this.totalEnriched);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
