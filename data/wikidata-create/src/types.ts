type Bbox = {
  w: number;
  n: number;
  e: number;
  s: number;
}

type WgsPoint = {
  lon: number;
  lat: number;
};

type Item = {
  wikidata: string;
  osm?: string;
  location: WgsPoint;
};
