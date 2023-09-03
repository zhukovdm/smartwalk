import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import InformPlaceListItem from "./InformPlaceListItem";

export type TraversableWaypointListProps = {

  /** Current map */
  map?: IMap;

  /** Waypoints lying on the direction (with `stored` flag) */
  waypoints: [UiPlace, boolean][];
};

/**
 * List of waypoints shown in the Result or Viewer panel for
 * both `routes` and `directions`.
 */
export default function TraversableWaypointList(
  { map, waypoints }: TraversableWaypointListProps): JSX.Element {

  return (
    <Stack
      role={"list"}
      aria-label={"Waypoints"}
      direction={"column"}
      gap={2}
    >
      {waypoints.map(([w, s], i) => (
        <Box
          key={i}
          aria-label={w.name}
          role={"listitem"}
        >
          <InformPlaceListItem
            place={w}
            kind={s ? "stored" : "common"}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(w); }}
          />
        </Box>
      ))}
    </Stack>
  );
}
