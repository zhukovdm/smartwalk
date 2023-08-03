/**
 * Point in [WGS84] CRS.
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
  selected: string[];
};

/**
 * Standard server-defined place representation.
 */
export type Place = PlaceAttributes & {
  grainId: string;
};

/**
 * Place as per represented in the user interface.
 */
export type UiPlace = PlaceAttributes & {
  placeId?: string;
  grainId?: string;
};

/**
 * Place as per stored in the IStorage.
 */
export type StoredPlace = PlaceAttributes & {
  placeId: string;
  grainId?: string;
};

/**
 * Entity external links with owl:sameAs semantics.
 */
type EntityLinked = {
  osm?: string;
  dbpedia?: string;
  geonames?: string;
  mapycz?: string;
  wikidata?: string;
  yago?: string;
};

/**
 * Entity address.
 */
export type EntityAddress = {
  country?: string;
  settlement?: string;
  district?: string;
  place?: string;
  house?: string;
  postalCode?: string;
};

/**
 * Entity payment options.
 */
export type EntityPayment = {
  cash?: boolean;
  card?: boolean;
  amex?: boolean;
  jcb?: boolean;
  mastercard?: boolean;
  visa?: boolean;
  crypto?: boolean;
};

/**
 * List of possible entity attributes.
 */
type EntityAttributes = {
  polygon?: WgsPoint[];
  image?: string;
  description?: string;
  website?: string;
  address?: EntityAddress;
  payment?: EntityPayment;
  email?: string;
  phone?: string;
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
  rating?: number;
  capacity?: number;
  minimumAge?: number;
  clothes?: string[];
  cuisine?: string[];
  rental?: string[];
};

/**
 * Place representation with links and entity-extended attributes.
 */
export type Entity = Place & {
  linked: EntityLinked;
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
export type Bounds = {
  rating: BoundNumeric;
  capacity: BoundNumeric;
  minimumAge: BoundNumeric;
  rental: string[];
  clothes: string[];
  cuisine: string[];
};

/**
 * Filter for checking attribute existence.
 */
export type KeywordFilterExisten = {};

/**
 * Possible attributes checked for existence.
 */
type KeywordFilterExistens = {
  image?: KeywordFilterExisten;
  description?: KeywordFilterExisten;
  website?: KeywordFilterExisten;
  address?: KeywordFilterExisten;
  payment?: KeywordFilterExisten;
  email?: KeywordFilterExisten;
  phone?: KeywordFilterExisten;
  charge?: KeywordFilterExisten;
  openingHours: KeywordFilterExisten;
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
  rating?: KeywordFilterNumeric;
  capacity?: KeywordFilterNumeric;
  minimumAge?: KeywordFilterNumeric;
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
  includes: string[],
  excludes: string[];
};

/**
 * Possible collections in the attributes.
 */
type KeywordFilterCollects = {
  rental?: KeywordFilterCollect;
  clothes?: KeywordFilterCollect;
  cuisine?: KeywordFilterCollect;
};

/**
 * All possible keyword filters.
 */
export type KeywordFilters = {
  existens: KeywordFilterExistens;
  booleans: KeywordFilterBooleans;
  numerics: KeywordFilterNumerics;
  textuals: KeywordFilterTextuals;
  collects: KeywordFilterCollects;
};

/**
 * Keyword and keyword-specific attributes.
 */
export type KeywordAutoc = {
  keyword: string;
  attributeList: string[];
};

/**
 * Condition enabling a place to be found.
 */
export type PlaceCondition = {
  keyword: string;
  filters: KeywordFilters;
};

/**
 * User-defined condition restricting search.
 */
export type KeywordCondition = PlaceCondition & {
  attributeList: string[];
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
  sequence: UiPlace[];
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

  /** Conditions to be fulfilled. */
  conditions: PlaceCondition[];
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

  /** Conditions to be fulfilled. */
  conditions: PlaceCondition[];
};

type RouteAttributes = RoutesRequest & {
  name: string;
  path: Path;
  waypoints: Place[];
};

export type UiRoute = RouteAttributes & {
  routeId?:string
};

export type StoredRoute = RouteAttributes & {
  routeId: string;
};
