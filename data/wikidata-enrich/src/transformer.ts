import {
  EnrichTransformer,
  ensureArray,
  getFirst,
  isValidKeyword
} from "../../shared/dist/src/index.js";

function handleKeywordArray(arr: { en: string | string[] } = { en: [] }) {
  return ensureArray(arr.en)
    .map((instance) => instance.toLowerCase())
    .map((instance) => isValidKeyword(instance) ? instance : undefined)
    .filter((instance) => instance !== undefined) as string[];
}

function handleDate(value: string) {
  const d = new Date(value).getFullYear();
  return isNaN(d) ? undefined : d;
}

function handleNumber(value: string) {
  const n = parseFloat(value);
  return isNaN(n) ? undefined : n;
}

function handleFacebook(value: string | undefined) {
  return value !== undefined ? `https://www.facebook.com/${value}` : undefined;
}

function handleInstagram(value: string | undefined) {
  return value !== undefined ? `https://www.instagram.com/${value}/` : undefined;
}

function handleLinkedin(value: string | undefined) {
  return value !== undefined ? `https://www.linkedin.com/in/${value}/` : undefined;
}

function handlePinterest(value: string | undefined) {
  return value !== undefined ? `https://www.pinterest.com/${value}/` : undefined;
}

function handleTelegram(value: string | undefined) {
  return value !== undefined ? `https://t.me/${value}` : undefined;
}

function handleTwitter(value: string | undefined) {
  return value !== undefined ? `https://twitter.com/${value}` : undefined;
}

function handleYoutube(value: string | undefined) {
  return value !== undefined ? `https://www.youtube.com/channel/${value}` : undefined;
}

function constructFromEntity(entity: any): any {
  const object = {} as any;

  const keywords = ([] as string[])
    .concat(handleKeywordArray(entity.genre))
    .concat(handleKeywordArray(entity.instance))
    .concat(handleKeywordArray(entity.facility))
    .concat(handleKeywordArray(entity.movement))
    .concat(handleKeywordArray(entity.archStyle))
    .concat(handleKeywordArray(entity.fieldWork));

  object.name = getFirst(entity.name?.en);
  object.description = getFirst(entity.description?.en);

  object.keywords = Array.from(new Set(keywords));

  // contacts
  object.image = getFirst(entity.image);
  object.email = getFirst(entity.email)?.substring(7); // mailto:
  object.phone = getFirst(entity.phone);
  object.website = getFirst(entity.website);

  object.facebook = handleFacebook(getFirst(entity.facebook));
  object.instagram = handleInstagram(getFirst(entity.instagram));
  object.linkedin = handleLinkedin(getFirst(entity.linkedin));
  object.pinterest = handlePinterest(getFirst(entity.pinterest));
  object.telegram = handleTelegram(getFirst(entity.telegram));
  object.twitter = handleTwitter(getFirst(entity.twitter));
  object.youtube = handleYoutube(getFirst(entity.youtube));

  // date
  object.year = handleDate(getFirst(entity.inception)) ?? handleDate(getFirst(entity.openingDate));

  // numbers
  object.capacity = handleNumber(getFirst(entity.capacity));
  object.elevation = handleNumber(getFirst(entity.elevation));
  object.minimumAge = handleNumber(getFirst(entity.minimumAge));

  object.country = getFirst(entity.country?.en);
  object.street = getFirst(entity.street?.en);
  object.house = getFirst(entity.house);
  object.postalCode = getFirst(entity.postalCode);

  // linked
  object.mapycz = getFirst(entity.mapycz);
  object.geonames = getFirst(entity.geonames);
  object.wikidata = entity.wikidata.substring(3); // cut wd:

  return object;
}

/**
 * Due to the complexity of the source and target types, type definitions
 * are omitted.
 */
export default class Transformer extends EnrichTransformer<any, any> {

  constructFromEntity(entity: any) {
    return constructFromEntity(entity);
  }
}
