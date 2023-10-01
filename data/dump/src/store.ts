import {
  Collection,
  type Document,
  FindCursor,
  MongoClient,
  type WithId
} from "mongodb";

const DATABASE_NAME = "smartwalk";

const PLACE_COLLECTION = "place";
const KEYWORD_COLLECTION = "keyword";

class StoreIterator implements AsyncIterator<any> {

  private readonly cursor: FindCursor<WithId<any>>;

  constructor(cursor: FindCursor<WithId<Document>>) {
    this.cursor = cursor as FindCursor<WithId<any>>;
  }

  async next(): Promise<IteratorResult<any, any | undefined>> {
    const hasNext = await this.cursor.hasNext();
    if (!hasNext) {
      await this.cursor.close();
    }
    return !hasNext
      ? { done: true, value: undefined }
      : { done: false, value: await this.cursor.next() };
  }
}

export class PlaceStore implements AsyncIterable<any> {

  private readonly client: MongoClient;
  private readonly placeColl: Collection;

  constructor(conn: string) {
    this.client = new MongoClient(conn);
    this.placeColl = this.client.db(DATABASE_NAME).collection(PLACE_COLLECTION);
  }

  [Symbol.asyncIterator](): AsyncIterator<any> {
    return new StoreIterator(this.placeColl.find());
  }

  async dispose() { this.client.close(); }
}

export class KeywordStore implements AsyncIterable<any> {

  private readonly client: MongoClient;
  private readonly keywordColl: Collection;

  constructor(conn: string) {
    this.client = new MongoClient(conn);
    this.keywordColl = this.client.db(DATABASE_NAME).collection(KEYWORD_COLLECTION);
  }

  [Symbol.asyncIterator](): AsyncIterator<any> {
    return new StoreIterator(this.keywordColl.find());
  }

  async dispose() { this.client.close(); }
}
