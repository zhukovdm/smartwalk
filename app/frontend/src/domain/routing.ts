const DIREC_ADDR = "/direc";
const PLACE_ADDR = "/place";
const ROUTE_ADDR = "/route";

const SEARCH_ADDR = "/search";

export const SEARCH_DIRECS_ADDR = `${SEARCH_ADDR}${DIREC_ADDR}s`;
export const SEARCH_PLACES_ADDR = `${SEARCH_ADDR}${PLACE_ADDR}s`;
export const SEARCH_ROUTES_ADDR = `${SEARCH_ADDR}${ROUTE_ADDR}s`;

const RESULT_ADDR = "/result";

export const RESULT_DIRECS_ADDR = `${RESULT_ADDR}${DIREC_ADDR}s`;
export const RESULT_PLACES_ADDR = `${RESULT_ADDR}${PLACE_ADDR}s`;
export const RESULT_ROUTES_ADDR = `${RESULT_ADDR}${ROUTE_ADDR}s`;

const ENTITY_ADDR = "/entity";

export const ENTITY_PLACES_ADDR = `${ENTITY_ADDR}${PLACE_ADDR}s`;

const VIEWER_ADDR = "/viewer";

export const VIEWER_DIREC_ADDR = `${VIEWER_ADDR}${DIREC_ADDR}`;
export const VIEWER_PLACE_ADDR = `${VIEWER_ADDR}${PLACE_ADDR}`;
export const VIEWER_ROUTE_ADDR = `${VIEWER_ADDR}${ROUTE_ADDR}`;

const SESSION_ADDR = "/session";

export const SESSION_SOLID_ADDR = `${SESSION_ADDR}/solid`;

export const HOME_ADDR = "/";
export const FAVORITES_ADDR = "/favorites";
