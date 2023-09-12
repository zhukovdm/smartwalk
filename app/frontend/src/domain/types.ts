/**
 * Recognized entities.
 */
export type SomethingKind = "direction" | "place" | "route";

/**
 * Recognized kinds of places (color schemata).
 */
export type PlaceKind = "stored" | "common" | "source" | "target" | "center" | "action";

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

  /** User-defined or server-defined name */
  name: string;

  /** Geo reference */
  location: WgsPoint;

  /** List of distinct keywords */
  keywords: string[];

  /** Cat identifiers that are satisfied by the place */
  categories: number[];
};

/**
 * Standard server-defined place representation.
 */
export type Place = PlaceAttributes & {

  /** Server-defined identifier */
  smartId: string;
};

/**
 * Place as per represented in the user interface.
 */
export type UiPlace = PlaceAttributes & {

  /** Identifier computed locally */
  placeId?: string;

  /** Server-defined identifier */
  smartId?: string;
};

/**
 * Place as per stored in the IStorage.
 */
export type StoredPlace = PlaceAttributes & {

  /** Identifier computed locally */
  placeId: string;

  /** Server-defined identifier */
  smartId?: string;
};

/**
 * Place external links with `owl:sameAs` semantic. In particular, all are
 * identifiers and shall be expanded.
 */
export type PlaceLinked = {

  /** DbPedia Id, `Item_Name`  */
  dbpedia?: string;

  /** GeoNames Id, `1` */
  geonames?: string;

  /** MapyCz Id, `base&id=1` */
  mapycz?: string;

  /** OpenStreetMap Id, `node/1` */
  osm?: string;

  /** Wikidata Id, `Q1` */
  wikidata?: string;

  /** Yago Id, `Item_Name` */
  yago?: string;
};

/**
 * Place address object.
 */
export type PlaceAddress = {

  /** Country */
  country?: string;

  /** City, town, village, etc. */
  settlement?: string;

  /** Part of a settlement, e.g. Praha 1 */
  district?: string;

  /** Street, square, avenue, etc. */
  place?: string;

  /** Conscription number of a house */
  house?: string;

  /** Postal code */
  postalCode?: string;
};

/**
 * Place social networks object.
 */
export type PlaceSocialNetworks = {

  /** Facebook profile */
  facebook?: string;

  /** Instagram profile */
  instagram?: string;

  /** LinkedIn profile */
  linkedin?: string;

  /** Pinterest profile */
  pinterest?: string;

  /** Telegram profile */
  telegram?: string;

  /** Twitter profile */
  twitter?: string;

  /** YouTube profile */
  youtube?: string;
};

/**
 * List of possible entity attributes.
 */
type EntityAttributes = {

  /** Sequence of at least 4 points */
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

  /** external identifiers */
  linked: PlaceLinked;

  /** additional attributes */
  attributes: EntityAttributes;
};

/**
 * Filter for checking attribute existence.
 */
export type AttributeFilterExisten = { };

/**
 * Possible attributes checked for existence.
 */
type AttributeFilterExistens = {
  description?: AttributeFilterExisten;
  image?: AttributeFilterExisten;
  website?: AttributeFilterExisten;
  address?: AttributeFilterExisten;
  email?: AttributeFilterExisten;
  phone?: AttributeFilterExisten;
  socialNetworks?: AttributeFilterExisten;
  charge?: AttributeFilterExisten;
  openingHours?: AttributeFilterExisten;
};

/**
 * Filter for boolean attributes.
 */
export type AttributeFilterBoolean = boolean;

/**
 * Possible boolean attributes.
 */
type AttributeFilterBooleans = {
  fee?: AttributeFilterBoolean;
  delivery?: AttributeFilterBoolean;
  drinkingWater?: AttributeFilterBoolean;
  internetAccess?: AttributeFilterBoolean;
  shower?: AttributeFilterBoolean;
  smoking?: AttributeFilterBoolean;
  takeaway?: AttributeFilterBoolean;
  toilets?: AttributeFilterBoolean;
  wheelchair?: AttributeFilterBoolean;
};

/**
 * Filter for numeric attributes.
 */
export type AttributeFilterNumeric = {
  min: number;
  max: number;
};

/**
 * Possible numeric attributes.
 */
type AttributeFilterNumerics = {
  capacity?: AttributeFilterNumeric;
  elevation?: AttributeFilterNumeric;
  minimumAge?: AttributeFilterNumeric;
  rating?: AttributeFilterNumeric;
  year?: AttributeFilterNumeric;
};

/**
 * Filter for textual attributes with "contains" semantics.
 */
export type AttributeFilterTextual = string;

/**
 * Possible textual attributes.
 */
type AttributeFilterTextuals = {
  name?: AttributeFilterTextual;
};

/**
 * Filter for collections with "include" and "exclude" semantics.
 */
export type AttributeFilterCollect = {

  /** Include any of */
  inc: string[];

  /** Exclude all of */
  exc: string[];
};

/**
 * Possible collections in the attributes.
 */
type AttributeFilterCollects = {
  clothes?: AttributeFilterCollect;
  cuisine?: AttributeFilterCollect;
  denomination?: AttributeFilterCollect;
  payment?: AttributeFilterCollect;
  rental?: AttributeFilterCollect;
};

/**
 * All possible attribute filters, setting filter means this particular
 * attribute shall exist on the object, and its value shall be within the
 * range defined by the filter.
 */
export type AttributeFilters = {

  /** existential filters */
  es?: AttributeFilterExistens;

  /** boolean filters */
  bs?: AttributeFilterBooleans;

  /** numeric filters */
  ns?: AttributeFilterNumerics;

  /** textual filters */
  ts?: AttributeFilterTextuals;

  /** collection filters */
  cs?: AttributeFilterCollects;
};

type NumericBound = {

  /** lower bound */
  min: number;

  /** upper bound */
  max: number;
};

type NumericBoundLabel = "capacity" | "elevation" | "minimumAge" | "rating" | "year";

/**
 * Bounds for numeric attributes.
 */
export type NumericBounds = {

  [key in NumericBoundLabel]?: NumericBound;
};

type CollectBound = string[];

type CollectBoundLabel = "clothes" | "cuisine" | "denomination" | "payment" | "rental";

/**
 * Bounds for collect attributes.
 */
export type CollectBounds = {
  [key in CollectBoundLabel]?: CollectBound;
};

/**
 * Keyword, keyword-specific attributes, and keyword-specific bounds.
 */
export type KeywordAdviceItem = {

  /** Keyword that make sense to look for */
  keyword: string;

  /** Options of attributes specific for a keyword */
  attributeList: string[];

  /** Numeric bounds imposed by a keyword and its attributes. */
  numericBounds: NumericBounds;

  /** Collect bounds imposed by a keyword and its attributes. */
  collectBounds: CollectBounds;
};

/**
 * Category enabling a place to be found.
 */
export type PlaceCategory = {

  /** Keyword that make sense to look for */
  keyword: string;

  /** Filters further specifying objects having a keyword */
  filters: AttributeFilters;
};



/**
 * User-defined category restricting search.
 */
export type KeywordCategory = PlaceCategory & KeywordAdviceItem;

export type PrecedenceEdge = {

  /** Category from. */
  fr: number;

  /** Category to. */
  to: number;
};

/**
 * Simple path with geometry, distance, and approximate duration.
 */
export type Path = {

  /** Walking distance in `km` */
  distance: number;

  /** Walking duration in `sec` */
  duration: number;

  /** Geometry defined by LineString */
  polyline: WgsPoint[];
};

/**
 * Any result upon direction request, known or new.
 */
export type DirecAttributes = {

  /** User-defined name */
  name: string;

  /** Exact traversal */
  path: Path;

  /** Places lying on the direction */
  waypoints: UiPlace[];
};

/**
 * Direction in the user interface, either stored or not.
 */
export type UiDirec = DirecAttributes & {

  /** Id generated locally */
  direcId?: string;
};

/**
 * Direction result as per stored in the IStorage.
 */
export type StoredDirec = DirecAttributes & {

  /** Id generated locally */
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

  /** List of found places */
  places: Place[];
};

type Waypoint = {

  /** Id of a place issued by the server */
  smartId: string;

  /** Exact match for a given category */
  category: number;
};

/**
 * Routes request.
 */
export type RoutesRequest = {

  /** Starting point. */
  source: UiPlace;

  /** Destination point. */
  target: UiPlace;

  /** Maximum walking distance (in kilometers) */
  maxDistance: number;

  /** Categories to be fulfilled. */
  categories: PlaceCategory[];

  /** Poset on categories. */
  precedence: PrecedenceEdge[];
};

type RouteAttributes = RoutesRequest & {

  /** User-defined name */
  name: string;

  /** Exact traversal */
  path: Path;

  /** Places lying on the path. */
  places: Place[];

  /** Ordered list of `(smartId, satisfied cat)` objects. */
  waypoints: Waypoint[];
};

export type UiRoute = RouteAttributes & {

  /** Id generated locally */
  routeId?:string
};

export type StoredRoute = RouteAttributes & {

  /** Id generated locally */
  routeId: string;
};
