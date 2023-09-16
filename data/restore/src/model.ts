import { Db, MongoClient, ObjectId } from "mongodb";
import Logger from "./logger";

const DATABASE_NAME = "smartwalk";

export default class Model {

  private placesCur = 0;
  private placesTot = 0;
  private keywordsTot = 0;

  private readonly logger: Logger;

  private readonly client: MongoClient;
  private readonly database: Db;

  private objects: any[] = [];

  private async write(coll: ObjectKind): Promise<void> {
    await this.database.collection(coll).bulkWrite(this.objects.map(({ _id, ...rest }) => ({
      insertOne: {
        document: { ...rest, _id: new ObjectId(_id) }
      }
    })));
    this.objects = [];
  }

  constructor(logger: Logger, conn: string) {
    this.logger = logger;

    this.client = new MongoClient(conn);
    this.database = this.client.db(DATABASE_NAME);
  }

  async createPlace(object: any): Promise<void> {
    if (this.objects.push(object) >= 1000) {
      await this.write("place");
    }

    if (++this.placesCur >= 10000) {
      this.placesTot += this.placesCur;
      this.placesCur = 0;
      this.logger.logPlacesCur(this.placesTot);
    }
  }

  async flushPlaces(): Promise<void> {
    if (this.objects.length > 0) {
      await this.write("place");
    }
    this.logger.logPlacesTot(this.placesTot + this.placesCur);
  }

  async createKeyword(object: any): Promise<void> {
    if (this.objects.push(object) >= 1000) {
      await this.write("keyword");
    }
    ++this.keywordsTot;
  }

  async flushKeywords(): Promise<void> {
    if (this.objects.length > 0) {
      await this.write("keyword");
    }
    this.logger.logKeywordsTot(this.keywordsTot);
  }

  async dispose(): Promise<void> { this.client.close(); }
}
