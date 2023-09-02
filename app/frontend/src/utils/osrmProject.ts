import axios from "axios";
import { Path, UiDirec, UiPlace, WgsPoint } from "../domain/types";

function getQuery(waypoints: WgsPoint[]) {
  const chain = waypoints.map((w) => `${w.lon},${w.lat}`).join(";");
  return `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${chain}?alternatives=true&geometries=geojson&skip_waypoints=true`;
}

export default class OsrmProjectFetcher {

  private static async fetch(url: string): Promise<any> {
    const res = await axios.get(url, {
      method: "GET"
    });
    switch (res.status) {
      case 200: return res.data;
      default: throw new Error(`${res.statusText} (status code ${res.status}, osrm code ${res.data?.code}).`)
    }
  }

  public static async searchDirecs(waypoints: UiPlace[]): Promise<UiDirec[]> {
    const jsn = await this.fetch(getQuery(waypoints.map((w) => w.location)));
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
}
