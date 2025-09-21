import axios from "axios";
import { UiPlace } from "../domain/types";
import IdGenerator from "./idGenerator";

/**
 * Maximum number of entities fetched from the service.
 */
const NOMINATIM_LIMIT: number = 5;

function getQuery(input: string): string {
  return `https://nominatim.openstreetmap.org/search?q=${input}&polygon_geojson=1&format=jsonv2&limit=${NOMINATIM_LIMIT}`;
}

async function nominatimFetch(url: string): Promise<any> {
  const res = await axios.get(url, {
    method: "GET"
  });
  switch (res.status) {
    case 200:
      return res.data;
    default:
      throw new Error(`${res.statusText} (status code ${res.status}, nominatim response ${res.data}).`);
  }
}

export async function fetchSearchPoints(input: string): Promise<UiPlace[]> {
  const jsn = await nominatimFetch(getQuery(input));

  return jsn
    .map((place: any) => ({
      name: place.display_name,
      location: {
        lon: Number(place.lon),
        lat: Number(place.lat)
      },
      keywords: [], categories: []
    } as UiPlace))
    .map((place: UiPlace) => ({
      ...place,
      placeId: IdGenerator.generateId(place)
    } as UiPlace));
}
