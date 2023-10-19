import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import InformPlaceListItem from "./InformPlaceListItem";
import TraversalWaypointList from "./TraversalWaypointList";

export type RouteContentListProps = {

  /** Current map */
  map?: IMap;

  /** Starting point */
  source: UiPlace;

  /** Destination */
  target: UiPlace;

  /** Visited places in-between (with `stored` flag) */
  waypoints: [UiPlace, boolean][];

  /** Show specific categorie (index-based) */
  filterList: boolean[];
};

/**
 * List of places forming a route, possibly with filtered categories.
 */
export default function RouteContentList(
  { map, source, target, waypoints, filterList }: RouteContentListProps): JSX.Element {

  return (
    <Stack gap={2}>
      <Box
        role={"region"}
        aria-label={"Starting point"}
      >
        <InformPlaceListItem
          kind={"source"}
          place={source}
          title={"Fly to"}
          onPlace={() => { map?.flyTo(source); }}
        />
      </Box>
      {filterList.some((f) => f) && (
        <TraversalWaypointList
          map={map}
          waypoints={waypoints}
        />
      )}
      <Box
        role={"region"}
        aria-label={"Destination"}
      >
        <InformPlaceListItem
          kind={"target"}
          place={target}
          title={"Fly to"}
          onPlace={() => { map?.flyTo(target); }}
        />
      </Box>
    </Stack>
  );
}
