import {
  Bounds,
  Entity,
  KeywordAutoc,
  PlacesRequest,
  PlacesResult,
  RoutesRequest,
  UiDirec,
  UiPlace,
  UiRoute
} from "../domain/types";

const GRAINPATH_BASIS_URL = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;

const GRAINPATH_AUTOCS_URL = GRAINPATH_BASIS_URL + "/autocs";
const GRAINPATH_BOUNDS_URL = GRAINPATH_BASIS_URL + "/bounds";
const GRAINPATH_DIRECS_URL = GRAINPATH_BASIS_URL + "/direcs";
const GRAINPATH_ENTITY_URL = GRAINPATH_BASIS_URL + "/entity";
const GRAINPATH_ROUTES_URL = GRAINPATH_BASIS_URL + "/routes";
const GRAINPATH_PLACES_URL = GRAINPATH_BASIS_URL + "/places";

/**
 * GrainPath-specific API calls.
 */
export class GrainPathFetcher {

  /**
   * Standard `POST` @b fetch from an application server. Only JSON content
   * type is available.
   */
  private static async fetch(url: string, body: any): Promise<any> {
    const content = "application/json";

    const rs = await fetch(url, {
      method: "POST",
      headers: { "Accept": content, "Content-Type": content },
      body: JSON.stringify(body)
    });
    switch (rs.status) {
      case 200: return rs.json();
      case 404: return undefined;
    //case 400:
    //case 500:
      default: throw new Error(`${rs.statusText} (status code ${rs.status}).`);
    }
  }

  /**
   * Fetch autocomplete items based on provided prefix.
   */
  public static async fetchAutocs(prefix: string): Promise<KeywordAutoc[] | undefined> {
    const jsn = await GrainPathFetcher
      .fetch(GRAINPATH_AUTOCS_URL, { count: 3, prefix: prefix });
    return jsn?.items;
  }

  /**
   * Fetch current bounds for selected attributes.
   */
  public static async fetchBounds(): Promise<Bounds | undefined> {
    return await GrainPathFetcher
      .fetch(GRAINPATH_BOUNDS_URL, {});
  }

  /**
   * Fetch walking path visiting a sequence of locations in a given order.
   */
  public static async fetchDirecs(sequence: UiPlace[]): Promise<UiDirec | undefined> {
    const waypoints = sequence.map((l) => l.location);
    const jsn = await GrainPathFetcher
      .fetch(GRAINPATH_DIRECS_URL, { waypoints: waypoints });
    return (jsn) ? { name: "", path: { ...jsn, distance: jsn.distance / 1000 }, sequence: sequence } : undefined;
  }

  /**
   * Fetch entity (place with extended information) by id.
   */
  public static async fetchEntity(grainId: string): Promise<Entity | undefined> {
    return await GrainPathFetcher
      .fetch(GRAINPATH_ENTITY_URL, { grainId: grainId });
  }

  /**
   * Fetch places satisfying user-defined conditions.
   */
  public static async fetchPlaces(request: PlacesRequest): Promise<PlacesResult> {
    const { center, radius, ...rest } = request;
    const jsn = await GrainPathFetcher
      .fetch(GRAINPATH_PLACES_URL, { center: center.location, radius: radius * 1000, ...rest });
    return { ...request, places: jsn };
  }

  /**
   * Fetch routes visiting places that satisfy user-defined conditions.
   */
  public static async fetchRoutes(request: RoutesRequest): Promise<UiRoute[]> {
    const { source, target, distance, ...rest } = request;
    const jsn = await GrainPathFetcher
      .fetch(GRAINPATH_ROUTES_URL, {
        ...rest,
        source: source.location,
        target: target.location,
        distance: distance * 1000
      });
    return jsn.routes.map((route: any) => {
      route.path.distance = route.path.distance / 1000;
      return { name: "", ...request, ...route };
    });
  }
}
