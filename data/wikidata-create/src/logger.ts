import consola, { type ConsolaInstance } from "consola";

export default class Logger {

  private readonly logger: ConsolaInstance;

  constructor() {
    this.logger = consola.create({});
  }

  public logCategory(cat: string) {
    this.logger.info(`> Processing category ${cat}...`);
  }

  public logCategoryBbox(cat: string, { w, n, e ,s }: Bbox) {
    this.logger.info(`> Contacting Wikidata SPARQL endpoint for square w=${w} n=${n} e=${e} s=${s} and category ${cat}.`);
  }

  public logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`> Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  public logFetchedEntities(cat: string, count: number) {
    this.logger.info(`> Fetched ${count} entities for ${cat} category.`);
  }

  public logItemsCreated(batchCreated: number, totalCreated: number) {
    this.logger.info(`> Created ${batchCreated} from this batch, and total ${totalCreated} entities.`)
  }

  public logFailedCreate(wikidata: string, err: unknown) {
    this.logger.warn(`> Failed to create an item with ${wikidata} identifier.`);
    this.logger.info(err);
  }

  public logError(err: unknown) { this.logger.error(err); }
}
