import axios from "axios";
import {
  Path,
  Place,
  UiDirec,
  UiPlace,
  UiRoute,
  WgsPoint
} from "../domain/types";

function getQuery(waypoints: WgsPoint[]) {
  const chain = waypoints.map((w) => `${w.lon},${w.lat}`).join(";");
  return `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${chain}?alternatives=true&geometries=geojson&skip_waypoints=true`;
}

async function osrmFetch(url: string): Promise<any> {
  const res = await axios.get(url, {
    method: "GET"
  });
  switch (res.status) {
    case 200:
      return res.data;
    default:
      throw new Error(`${res.statusText} (status code ${res.status}, osrm code ${res.data?.code}).`);
  }
}

export async function fetchSearchDirecs(waypoints: UiPlace[]): Promise<UiDirec[]> {
  const jsn = await osrmFetch(getQuery(waypoints.map((w) => w.location)));

  if (jsn?.code !== "Ok") { return []; }

  return jsn.routes
    .map((r: any) => ({
      distance: r.distance / 1000.0,
      duration: r.duration,
      polyline: r.geometry.coordinates
        .map(([lon, lat]: [number, number]) => ({ lon: lon, lat: lat }))
    }))
    .map((p: Path) => ({
      name: "",
      path: p,
      waypoints: waypoints
    }))
    .sort((l: UiDirec, r: UiDirec) => Math.sign(l.path.distance - r.path.distance));
}

export async function ensureRouteHasShortestPath(route: UiRoute): Promise<UiRoute> {
  const {
    source: s,
    target: t,
    waypoints
  } = route;

  let path = route.path;

  if (!path) {
    const ps = route.places
      .reduce((acc, place) => acc.set(place.smartId, place), new Map<string, Place>());

    path = (await fetchSearchDirecs([s, ...waypoints.map(w => ps.get(w.smartId)!), t]))
      .sort((l, r) => Math.sign(l.path.distance - r.path.distance))[0]
      .path;
  }

  return { ...route, path: path };
}
