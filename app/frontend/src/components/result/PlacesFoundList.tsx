import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Map as IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import InformPlaceListItem from "../_shared/InformPlaceListItem";

export type PlacesFoundListProps = {

  /** Current map */
  map?: IMap;

  /** Places to be listed with `stored` flag */
  places: [UiPlace, boolean][];
};

/**
 * List of places obtained in the result (with replacement).
 */
export default function PlacesFoundList({ map, places }: PlacesFoundListProps): JSX.Element {

  return (
    <Stack
      role={"list"}
      aria-label={"Places found"}
      gap={2}
      direction={"column"}
    >
      {places.map(([p, s], i) => (
        <Box
          key={i}
          role={"listitem"}
          aria-label={p.name}
        >
          <InformPlaceListItem
            place={p}
            kind={s ? "stored" : "common"}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(p); }}
          />
        </Box>
      ))}
    </Stack>
  );
}
