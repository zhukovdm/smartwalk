import {
  Collection,
  Db,
  type Document,
  FindCursor,
  MongoClient,
  type WithId
} from "mongodb";
import Logger from "./logger";

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
  private readonly keywdCollHandle: string;

  constructor(logger: Logger, conn: string) {
    this.logger = logger;

    this.client = new MongoClient(conn);
    this.database = this.client.db("smartwalk");

    this.placeColl = this.database.collection("place");

    this.keywdCollHandle = "keyword";
    this.keywdColl = this.database.collection(this.keywdCollHandle);
  }

  [Symbol.asyncIterator](): AsyncIterator<Place> {
    return new ModelIterator(this.placeColl.find());
  }

  async dropCollection(): Promise<void> {
    try {
      await this.database.dropCollection(this.keywdCollHandle);
      this.logger.logCollectionDropped(this.keywdCollHandle);
    } catch (ex) { this.logger.logError(ex); }
  }

  async create(item: Item): Promise<void> {
    const set2arr = (set: Set<string> | undefined) => set ? Array.from(set).sort() : undefined;

    const {
      attributeList,
      collects: cs
    } = item;

    try {
      await this.keywdColl.insertOne({
        ...item,
        attributeList: set2arr(attributeList),
        collects: (["clothes", "cuisine", "denomination", "payment", "rental"] as CollectLabel[]).reduce((acc, label) => {
          acc[label] = set2arr(cs[label]);
          return acc;
        }, {} as { [key: string]: string[] | undefined })
      }, {
        ignoreUndefined: true
      });
      ++this.createdTot;
    }
    catch (ex) { this.logger.logFailedCreate(item.keyword, ex); }
  }

  reportCreatedTot() {
    this.logger.logCreatedTot(this.createdTot);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
