import {
  BoundsAdvice,
  ExtendedPlace,
  KeywordAdviceItem,
  PlacesRequest,
  PlacesResult,
  RoutesRequest,
  UiDirec,
  UiPlace,
  UiRoute
} from "../domain/types";

const SMARTWALK_BASE_URL = process.env.REACT_APP_API_ADDRESS!;

// advice service

const SMARTWALK_ADVICE_URL = SMARTWALK_BASE_URL + "/advice";
const SMARTWALK_ADVICE_BOUNDS_URL = SMARTWALK_ADVICE_URL + "/bounds";
const SMARTWALK_ADVICE_KEYWORDS_URL = SMARTWALK_ADVICE_URL + "/keywords?";

// entity service

const SMARTWALK_ENTITY_URL = SMARTWALK_BASE_URL + "/entity";
const SMARTWALK_ENTITY_PLACES_URL = SMARTWALK_ENTITY_URL + "/places";

// search service

const SMARTWALK_SEARCH_URL = SMARTWALK_BASE_URL + "/search";
const SMARTWALK_SEARCH_DIRECS_URL = SMARTWALK_SEARCH_URL + "/direcs?query=";
const SMARTWALK_SEARCH_PLACES_URL = SMARTWALK_SEARCH_URL + "/places?query=";
const SMARTWALK_SEARCH_ROUTES_URL = SMARTWALK_SEARCH_URL + "/routes?query=";

/**
 * SmartWalk-specific API calls.
 */
export class SmartWalkFetcher {

  /**
   * Standard `GET` from an application server. Note that only JSON content
   * type is available.
   * @param url endpoint with query string
   */
  private static async fetch(url: string): Promise<any> {
    const content = "application/json";

    const rs = await fetch(url, {
      method: "GET",
      headers: { "Accept": content }
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
   * Fetch latest attribute bounds.
   */
  public static adviceBounds(): Promise<BoundsAdvice> {
    return SmartWalkFetcher.fetch(SMARTWALK_ADVICE_BOUNDS_URL);
  }

  /**
   * Fetch keyword advice based on provided prefix.
   */
  public static adviceKeywords(prefix: string): Promise<KeywordAdviceItem[]> {
    const qry = new URLSearchParams({ prefix: prefix, count: "5" });
    return SmartWalkFetcher.fetch(SMARTWALK_ADVICE_URL + qry);
  }

  /**
   * Fetch place with links and attributes by smartId.
   */
  public static async entityPlaces(smartId: string): Promise<ExtendedPlace | undefined> {
    return SmartWalkFetcher.fetch(`${SMARTWALK_ENTITY_PLACES_URL}/${smartId}`);
  }

  /**
   * Fetch walking path visiting a sequence of locations in a given order.
   */
  public static async searchDirecs(waypoints: UiPlace[]): Promise<UiDirec | undefined> {
    const qry = { waypoints: waypoints.map((l) => l.location) };
    const jsn = await SmartWalkFetcher.fetch(SMARTWALK_SEARCH_DIRECS_URL + encodeURIComponent(JSON.stringify(qry)));

    return (jsn)
      ? { name: "", path: { ...jsn, distance: jsn.distance / 1000.0 }, waypoints: waypoints }
      : undefined;
  }

  /**
   * Fetch places satisfying user-defined categories.
   */
  public static async searchPlaces(request: PlacesRequest): Promise<PlacesResult> {
    const { center, radius, ...rest } = request;
    const qry = { ...rest, center: center.location, radius: radius * 1000.0 };
    const jsn = await SmartWalkFetcher.fetch(SMARTWALK_SEARCH_PLACES_URL + encodeURIComponent(JSON.stringify(qry)));

    return { ...request, places: jsn };
  }

  /**
   * Fetch routes that visit places belonging to at least one user-defined category.
   */
  public static async searchRoutes(request: RoutesRequest): Promise<UiRoute[]> {
    const { source, target, distance, ...rest } = request;
    const qry = { ...rest, source: source.location, target: target.location, distance: distance * 1000.0 };
    const jsn = await SmartWalkFetcher.fetch(SMARTWALK_SEARCH_ROUTES_URL + encodeURIComponent(JSON.stringify(qry)));

    return jsn.map((route: any) => {
      route.path.distance = route.path.distance / 1000.0;
      return { name: "", ...request, ...route };
    });
  }
}
