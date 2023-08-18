/**
 * Point in [WGS84] CRS with web mercator bounds.
 * - https://epsg.io/3857
 * - https://epsg.io/4326
 */
export type WgsPoint = {

  /** Longitude. */
  lon: number;

  /** Latitude. */
  lat: number;
};

/**
 * Every point-like object has these attributes.
 */
type PlaceAttributes = {
  name: string;
  location: WgsPoint;
  keywords: string[];
  categories: number[];
};

/**
 * Standard server-defined place representation.
 */
export type Place = PlaceAttributes & {
  smartId: string;
};

/**
 * Place as per represented in the user interface.
 */
export type UiPlace = PlaceAttributes & {
  placeId?: string;
  smartId?: string;
};

/**
 * Place as per stored in the IStorage.
 */
export type StoredPlace = PlaceAttributes & {
  placeId: string;
  smartId?: string;
};

/**
 * Place external links with owl:sameAs semantics.
 */
type PlaceLinked = {
  dbpedia?: string;
  geonames?: string;
  mapycz?: string;
  osm?: string;
  wikidata?: string;
  yago?: string;
};

/**
 * Place address object.
 */
export type PlaceAddress = {
  country?: string;
  settlement?: string;
  district?: string;
  place?: string;
  house?: string;
  postalCode?: string;
};

/**
 * Place social networks object.
 */
export type PlaceSocialNetworks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  pinterest?: string;
  telegram?: string;
  twitter?: string;
  youtube?: string;
};

/**
 * List of possible entity attributes.
 */
type EntityAttributes = {
  polygon?: WgsPoint[];
  description?: string;
  image?: string;
  website?: string;
  address?: PlaceAddress;
  email?: string;
  phone?: string;
  socialNetworks?: PlaceSocialNetworks;
  charge?: string[];
  openingHours?: string[];
  fee?: boolean;
  delivery?: boolean;
  drinkingWater?: boolean;
  internetAccess?: boolean;
  shower?: boolean;
  smoking?: boolean;
  takeaway?: boolean;
  toilets?: boolean;
  wheelchair?: boolean;
  capacity?: number;
  elevation?: number;
  minimumAge?: number;
  rating?: number;
  year?: number;
  clothes?: string[];
  cuisine?: string[];
  denomination?: string[];
  payment?: string[];
  rental?: string[];
};

/**
 * Place representation with links and attributes.
 */
export type ExtendedPlace = Place & {
  linked: PlaceLinked;
  attributes: EntityAttributes;
};

/**
 * Bounds for numeric attributes.
 */
type BoundNumeric = {
  min: number;
  max: number;
};

/**
 * Current bounds limiting user input fields.
 */
export type BoundsAdvice = {
  capacity: BoundNumeric;
  elevation: BoundNumeric;
  minimumAge: BoundNumeric;
  rating: BoundNumeric;
  year: BoundNumeric;
  clothes: string[];
  cuisine: string[];
  denomination: string[];
  payment: string[];
  rental: string[];
};

/**
 * Filter for checking attribute existence.
 */
export type KeywordFilterExisten = { };

/**
 * Possible attributes checked for existence.
 */
type KeywordFilterExistens = {
  description?: KeywordFilterExisten;
  image?: KeywordFilterExisten;
  website?: KeywordFilterExisten;
  address?: KeywordFilterExisten;
  email?: KeywordFilterExisten;
  phone?: KeywordFilterExisten;
  socialNetworks?: KeywordFilterExisten;
  charge?: KeywordFilterExisten;
  openingHours?: KeywordFilterExisten;
};

/**
 * Filter for boolean attributes.
 */
export type KeywordFilterBoolean = boolean;

/**
 * Possible boolean attributes.
 */
type KeywordFilterBooleans = {
  fee?: KeywordFilterBoolean;
  delivery?: KeywordFilterBoolean;
  drinkingWater?: KeywordFilterBoolean;
  internetAccess?: KeywordFilterBoolean;
  shower?: KeywordFilterBoolean;
  smoking?: KeywordFilterBoolean;
  takeaway?: KeywordFilterBoolean;
  toilets?: KeywordFilterBoolean;
  wheelchair?: KeywordFilterBoolean;
};

/**
 * Filter for numeric attributes.
 */
export type KeywordFilterNumeric = {
  min: number;
  max: number;
};

/**
 * Possible numeric attributes.
 */
type KeywordFilterNumerics = {
  capacity?: KeywordFilterNumeric;
  elevation?: KeywordFilterNumeric;
  minimumAge?: KeywordFilterNumeric;
  rating?: KeywordFilterNumeric;
  year?: KeywordFilterNumeric;
};

/**
 * Filter for textual attributes with "contains" semantics.
 */
export type KeywordFilterTextual = string;

/**
 * Possible textual attributes.
 */
type KeywordFilterTextuals = {
  name?: KeywordFilterTextual;
};

/**
 * Filter for collections with "include" and "exclude" semantics.
 */
export type KeywordFilterCollect = {

  /** Include any of */
  inc: string[];

  /** Exclude all of */
  exc: string[];
};

/**
 * Possible collections in the attributes.
 */
type KeywordFilterCollects = {
  clothes?: KeywordFilterCollect;
  cuisine?: KeywordFilterCollect;
  denomination?: KeywordFilterCollect;
  payment?: KeywordFilterCollect;
  rental?: KeywordFilterCollect;
};

/**
 * All possible keyword filters.
 */
export type KeywordFilters = {
  es?: KeywordFilterExistens;
  bs?: KeywordFilterBooleans;
  ns?: KeywordFilterNumerics;
  ts?: KeywordFilterTextuals;
  cs?: KeywordFilterCollects;
};

/**
 * Keyword and keyword-specific attributes.
 */
export type KeywordAdviceItem = {
  keyword: string;
  attributeList: string[];
};

/**
 * Category enabling a place to be found.
 */
export type PlaceCategory = {
  keyword: string;
  filters: KeywordFilters;
};

/**
 * User-defined category restricting search.
 */
export type KeywordCategory = PlaceCategory & {
  attributeList: string[];
};

export type PrecedenceEdge = {

  /** Category from. */
  fr: number;

  /** Category to. */
  to: number;
};

/**
 * Simple path with geometry, distance, approximate duration.
 */
type Path = {
  distance: number;
  duration: number;
  polyline: WgsPoint[];
};

/**
 * Any result upon direction request, known or new.
 */
export type DirecAttributes = {
  name: string;
  path: Path;
  waypoints: UiPlace[];
};

/**
 * Direction in the user interface, either stored or not.
 */
export type UiDirec = DirecAttributes & {
  direcId?: string;
};

/**
 * Direction result as per stored in the IStorage.
 */
export type StoredDirec = DirecAttributes & {
  direcId: string;
};

/**
 * Places request.
 */
export type PlacesRequest = {

  /** Pivot point. */
  center: UiPlace;

  /** Radius in kilometers. */
  radius: number;

  /** Categories to be fulfilled. */
  categories: PlaceCategory[];
};

/**
 * Places result as per presented to the user.
 */
export type PlacesResult = PlacesRequest & {
  places: Place[];
};

/**
 * Routes request.
 */
export type RoutesRequest = {

  /** Starting point. */
  source: UiPlace;

  /** Destination point. */
  target: UiPlace;

  /** Distance in kilometers. */
  distance: number;

  /** Categories to be fulfilled. */
  categories: PlaceCategory[];

  /** Poset on categories. */
  precedence: PrecedenceEdge[];
};

type RouteAttributes = RoutesRequest & {

  /** */
  name: string;

  /**  */
  path: Path;

  /** Places lying on the path. */
  places: Place[];

  /** Ordered list of smartId identifiers. */
  waypoints: string[];
};

export type UiRoute = RouteAttributes & {
  routeId?:string
};

export type StoredRoute = RouteAttributes & {
  routeId: string;
};
