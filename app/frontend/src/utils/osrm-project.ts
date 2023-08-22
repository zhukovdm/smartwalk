import { UiDirec, UiPlace, WgsPoint } from "../domain/types";

function getQuery(waypoints: WgsPoint[]) {
  const chain = waypoints.map((w) => `${w.lon},${w.lat}`).join(";");
  return `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${chain}?alternatives=true&geometries=geojson&skip_waypoints=true`;
}

export class OsrmProjectFetcher {

  private static async fetch(url: string): Promise<any> {
    const res = await fetch(url);
    const jsn = await res.json();
    switch (res.status) {
      case 200: return jsn;
      default: throw new Error(`${res.statusText} (status code ${res.status}, osrm code ${jsn?.code}).`)
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
      .map((p: any) => ({ name: "", path: p, waypoints: waypoints }))
      .sort((l: any, r: any) => l.length - r.length);
  }
}
