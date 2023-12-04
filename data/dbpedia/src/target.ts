import {
  EnrichLogger,
  EnrichTarget,
  getDateTime,
  getPayloadIter
} from "../../shared/dist/src/index.js";

export default class Target extends EnrichTarget<any> {

  private totalEnriched = 0;
  private readonly logger: EnrichLogger;

  constructor(logger: EnrichLogger, conn: string) {
    super(conn);
    this.logger = logger;
  }

  /**
   * Get all place identifiers in the database.
   * @param window Maximum number of items in one batch.
   * @returns Iterator over a list of identifiers.
   */
  async getPayloadIter(window: number): Promise<{
    [Symbol.iterator](): Generator<string[], void, unknown>;
  }> {
    const payload = await this.getPayload();
    this.logger.logPayloadLength(payload.length);

    return getPayloadIter(payload, window, this.logger);
  }

  async load(items: any[]): Promise<void> {
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
            "attributes.website": item.website,
            "attributes.year": item.year,
            "linked.dbpedia": item.dbpedia,
            "linked.yago": item.yago,
            "metadata.updated": getDateTime()
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
