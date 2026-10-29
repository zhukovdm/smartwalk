export type Bbox = {
  w: number;
  n: number;
  e: number;
  s: number;
}

export type WgsPoint = {
  lon: number;
  lat: number;
};

export type Item = {
  wikidata: string;
  osm?: string;
  location: WgsPoint;
};
