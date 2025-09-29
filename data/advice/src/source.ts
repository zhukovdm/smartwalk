import {
  Collection,
  type Document,
  FindCursor,
  MongoClient,
  type WithId
} from "mongodb";

const DATABASE_NAME = "smartwalk";
const PLACES_COLLECTION = "places";

class SourceIterator implements AsyncIterator<Place> {

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

export default class Source {

  private readonly client: MongoClient;
  private readonly placeColl: Collection;

  constructor(conn: string) {
    this.client = new MongoClient(conn);
    this.placeColl = this.client.db(DATABASE_NAME).collection(PLACES_COLLECTION);
  }

  [Symbol.asyncIterator](): AsyncIterator<Place> {
    return new SourceIterator(this.placeColl.find());
  }

  async dispose(): Promise<void> { this.client.close(); }
}
