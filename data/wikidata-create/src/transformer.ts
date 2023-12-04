import {
  getFirst,
  roundCoordinate
} from "../../shared/dist/src/index.js";

/**
 * Extract longitude and latitude from WKT literal.
 * @param location WKT point `Point(lon lat)`
 */
function extractLocation(location: string): WgsPoint {
  const re = /^Point\((?<lon>-?\d+(\.\d+)?) (?<lat>-?\d+(\.\d+)?)\)$/i;
  const { lon, lat } = re.exec(location)!.groups!;
  return {
    lon: roundCoordinate(parseFloat(lon!)),
    lat: roundCoordinate(parseFloat(lat!))
  };
}

function extractOsmId(n?: string, w?: string, r?: string): string | undefined {
  const f = (prefix: string, id?: string) => (!!id) ? `${prefix}/${id}` : undefined;
  return f("node", n) ?? f("way", w) ?? f("relation", r);
}

const constructFromEntity = (entity: any): Item => ({
  location: extractLocation(getFirst(entity.location)),
  osm: extractOsmId(getFirst(entity.osmN), getFirst(entity.osmW), getFirst(entity.osmR)),
  wikidata: entity.wikidata.substring(3) as string // cut off `wd:`
});

export default class Transformer {

  async transform(items: any[]): Promise<Item[]> {
    items = items.map((entity: any) => constructFromEntity(entity));
    return Promise.resolve(items);
  }
}
