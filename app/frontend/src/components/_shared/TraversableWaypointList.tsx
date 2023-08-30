import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import InformPlaceListItem from "./InformPlaceListItem";

type TraversableWaypointListProps = {

  /** Current map */
  map?: IMap;

  /** Places on the direction */
  places: UiPlace[];
};

/**
 * List of waypoints shown in the Result or Viewer panel for
 * both `routes` and `directions`.
 */
export default function TraversableWaypointList(
  { map, places }: TraversableWaypointListProps): JSX.Element {

  return (
    <Stack
      role={"list"}
      aria-label={"Waypoints"}
      direction={"column"}
      gap={2}
    >
      {places.map((place, i) => (
        <Box
          key={i}
          aria-label={place.name}
          role={"listitem"}
        >
          <InformPlaceListItem
            place={place}
            kind={!!place.placeId ? "stored" : "common"}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(place); }}
          />
        </Box>
      ))}
    </Stack>
  );
}
