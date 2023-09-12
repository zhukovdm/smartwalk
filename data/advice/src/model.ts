import {
  Collection,
  Db,
  type Document,
  FindCursor,
  MongoClient,
  type WithId
} from "mongodb";
import Logger from "./logger";

const DATABASE_NAME = "smartwalk";
const PLACE_COLLECTION = "place";
const KEYWD_COLLECTION = "keyword";

const set2arr = (set: Set<string> | undefined) => (set ? Array.from(set).sort() : undefined);

class ModelIterator implements AsyncIterator<Place> {

  private readonly cursor: FindCursor<WithId<Place>>;

  constructor(cursor: FindCursor<WithId<Document>>) {
    this.cursor = cursor as FindCursor<WithId<Place>>;
  }

  async next(): Promise<IteratorResult<Place, Place | undefined>> {
    const hasNext = await this.cursor.hasNext();
    if (!hasNext) {
      await this.cursor.close();
    }
    return !hasNext
      ? { done: true, value: undefined }
      : { done: false, value: (await this.cursor.next()) as Place };
  }
}

export default class Model implements AsyncIterable<Place> {

  private createdTot = 0;
  private readonly logger: Logger;

  private readonly client: MongoClient;
  private readonly database: Db;

  private readonly placeColl: Collection;
  private readonly keywdColl: Collection;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;

    this.client = new MongoClient(conn);
    this.database = this.client.db(DATABASE_NAME);

    this.placeColl = this.database.collection(PLACE_COLLECTION);
    this.keywdColl = this.database.collection(KEYWD_COLLECTION);
  }

  [Symbol.asyncIterator](): AsyncIterator<Place> {
    return new ModelIterator(this.placeColl.find());
  }

  async safeDropCollection(): Promise<void> {
    try {
      await this.database.dropCollection(KEYWD_COLLECTION);
      this.logger.logCollectionDropped(KEYWD_COLLECTION);
    } catch (ex) { this.logger.logError(ex); }
  }

  async create(item: Item): Promise<void> {
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

  reportCreatedTot() {
    this.logger.logCreatedTot(this.createdTot);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
