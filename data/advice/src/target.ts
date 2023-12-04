import {
  Collection,
  Db,
  MongoClient
} from "mongodb";
import Logger from "./logger.js";

const DATABASE_NAME = "smartwalk";
const KEYWD_COLLECTION = "keyword";

const set2arr = (set: Set<string> | undefined) => (set ? Array.from(set).sort() : undefined);

export default class Target {

  private createdTot = 0;
  private readonly logger: Logger;

  private readonly client: MongoClient;
  private readonly database: Db;
  private readonly keywdColl: Collection;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;
    this.client = new MongoClient(conn);
    this.database = this.client.db(DATABASE_NAME);
    this.keywdColl = this.database.collection(KEYWD_COLLECTION);
  }

  /**
   * Initialize target (clean up the previous state).
   */
  async init(): Promise<void> {
    try {
      await this.database.dropCollection(KEYWD_COLLECTION);
      this.logger.logCollectionDropped(KEYWD_COLLECTION);
    } catch (ex) { this.logger.logError(ex); }
  }

  /**
   * @param item Item to be loaded.
   */
  async load(item: Item): Promise<void> {
    const { attributeList, collectBounds } = item;

    try {
      const obj = {
        ...item,
        attributeList: set2arr(attributeList),
        collectBounds: (["clothes", "cuisine", "denomination", "payment", "rental"] as CollectBoundLabel[]).reduce((acc, label) => {
          acc[label] = set2arr(collectBounds[label]);
          return acc;
        }, {} as { [key in CollectBoundLabel]?: string[]; })
      };

      const options = {
        ignoreUndefined: true
      };

      await this.keywdColl.insertOne(obj, options);
      ++this.createdTot;
    }
    catch (ex) {
      this.logger.logFailedCreate(item.keyword, ex);
    }
  }

  /**
   * Report total number of items created.
   */
  reportCreatedTot() {
    this.logger.logCreatedTot(this.createdTot);
  }

  /**
   * Release allocated resources gracefully.
   */
  async dispose(): Promise<void> { this.client.close(); }
}
