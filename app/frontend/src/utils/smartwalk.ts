import axios from "axios";
import crowFlyDistance from "@turf/distance";
import {
  ExtendedPlace,
  KeywordAdviceItem,
  PlacesRequest,
  PlacesResult,
  RoutesRequest,
  UiDirec,
  UiPlace,
  UiRoute,
  WgsPoint
} from "../domain/types";
import OsrmProjectFetcher from "./osrmProject";

const SMARTWALK_BASE_URL = process.env.REACT_APP_API_ADDRESS!;

// advice service

const SMARTWALK_ADVICE_URL = SMARTWALK_BASE_URL + "/advice";
const SMARTWALK_ADVICE_KEYWORDS_URL = SMARTWALK_ADVICE_URL + "/keywords?";

// entity service

const SMARTWALK_ENTITY_URL = SMARTWALK_BASE_URL + "/entity";
const SMARTWALK_ENTITY_PLACES_URL = SMARTWALK_ENTITY_URL + "/places";

// search service

const SMARTWALK_SEARCH_URL = SMARTWALK_BASE_URL + "/search";
// const SMARTWALK_SEARCH_DIRECS_URL = SMARTWALK_SEARCH_URL + "/direcs?query=";
const SMARTWALK_SEARCH_PLACES_URL = SMARTWALK_SEARCH_URL + "/places?query=";
const SMARTWALK_SEARCH_ROUTES_URL = SMARTWALK_SEARCH_URL + "/routes?query=";

/**
 * SmartWalk-specific API calls.
 */
export default class SmartWalkFetcher {

  /**
   * Standard `GET` from an application server. Note that only JSON content
   * type is available.
   * @param url endpoint url with a query string
   */
  private static async fetch(url: string): Promise<any> {
    const content = "application/json; charset=utf-8";

    const res = await axios.get(url, {
      method: "GET",
      headers: { "Accept": content }
    });

    switch (res.status) {
      case 200: return res.data;
      case 404: return undefined;
    //case 400:
    //case 500:
      default: throw new Error(`${res.statusText} (status code ${res.status}).`);
    }
  }

  /**
   * Fetch at most 5 keywords based on provided prefix.
   */
  public static adviceKeywords(prefix: string): Promise<KeywordAdviceItem[]> {
    const qry = new URLSearchParams({ prefix: prefix, count: "5" });
    return SmartWalkFetcher.fetch(SMARTWALK_ADVICE_KEYWORDS_URL + qry);
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
  public static async searchDirecs(waypoints: UiPlace[]): Promise<UiDirec[]> {
    // const qry = { waypoints: waypoints.map((w) => w.location) };
    // const jsn = await SmartWalkFetcher
    //   .fetch(SMARTWALK_SEARCH_DIRECS_URL + encodeURIComponent(JSON.stringify(qry)));

    // return jsn.map((direc: any) => ({
    //   name: "",
    //   path: {
    //     ...direc,
    //     distance: direc.distance / 1000.0
    //   },
    //   waypoints: waypoints
    // }));
    return OsrmProjectFetcher.searchDirecs(waypoints);
  }

  /**
   * Fetch places satisfying user-defined categories.
   */
  public static async searchPlaces(request: PlacesRequest): Promise<PlacesResult> {
    const { center, radius, ...rest } = request;
    const qry = { ...rest, center: center.location, radius: radius * 1000.0 };
    const jsn = await SmartWalkFetcher
      .fetch(SMARTWALK_SEARCH_PLACES_URL + encodeURIComponent(JSON.stringify(qry)));

    return { ...request, places: jsn };
  }

  /**
   * Fetch routes that visit places belonging to at least one user-defined category.
   */
  public static async searchRoutes(request: RoutesRequest): Promise<UiRoute[]> {
    const { source, target, distance, ...rest } = request;

    const toGeoJson = (point: WgsPoint) => ({
      type: "Point",
      coordinates: [point.lon, point.lat]
    } as {
      type: "Point",
      coordinates: [number, number]
    });

    const fr = toGeoJson(source.location);
    const to = toGeoJson(target.location);
    const cf = crowFlyDistance(fr, to, { units: "kilometers" });

    if (cf > distance) {
      throw Error(`Points are too far from each other (at least ${parseFloat(cf.toFixed(2))} km). Move them closer, or adjust the distance slider.`);
    }

    const qry = {
      ...rest,
      source: source.location,
      target: target.location,
      distance: distance * 1000.0
    };

    const jsn = await SmartWalkFetcher
      .fetch(SMARTWALK_SEARCH_ROUTES_URL + encodeURIComponent(JSON.stringify(qry)));

    return jsn.map((route: any) => {
      route.path.distance /= 1000.0;
      return { name: "", ...request, ...route };
    });
  }
}
