import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import TraversableWaypointList from "./TraversableWaypointList";
import InformPlaceListItem from "./InformPlaceListItem";

type RouteContentListProps = {

  /** Current map */
  map: IMap | undefined;

  /** Starting point */
  source: UiPlace;

  /** Destination */
  target: UiPlace;

  /** Visited places in-between */
  places: UiPlace[];

  /** Show/hide specific categorie (index-based) */
  filterList: boolean[];
};

/**
 * List of places forming a route, possibly with filtered categories.
 */
export default function RouteContentList(
  { map, source, target, places, filterList }: RouteContentListProps): JSX.Element {

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
        <TraversableWaypointList
          map={map}
          places={places}
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
