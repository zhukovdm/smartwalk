import {
  EnrichTransformer,
  getFirst
} from "../../shared/dist/src/index.js";

function handleDate(value: string) {
  const d = new Date(value).getFullYear();
  return isNaN(d) ? undefined : d;
}

function constructFromEntity(entity: any): any {
  const object = {} as any;

  // en-containers
  object.name = getFirst(entity.name?.en);
  object.description = getFirst(entity.description?.en);

  // lists
  object.image = getFirst(entity.image);
  object.website = getFirst(entity.website);

  // dates
  object.year = handleDate(getFirst(entity.date));

  // linked
  object.dbpedia = (getFirst(entity.dbpedia))?.substring(3);
  object.yago = (getFirst(entity.yago))?.substring(3);

  // existing
  object.wikidata = entity.wikidata.substring(3);

  return object;
}

export default class Transformer extends EnrichTransformer<any, any> {

  constructFromEntity(entity: any) {
    return constructFromEntity(entity);
  }
}
