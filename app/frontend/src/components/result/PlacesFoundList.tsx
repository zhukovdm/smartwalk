import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import InformPlaceListItem from "../_shared/InformPlaceListItem";

type PlacesFoundListProps = {

  /** Current map */
  map?: IMap;

  /** Places to be listed */
  places: UiPlace[];
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
      {places.map((place, i) => (
        <Box
          key={i}
          role={"listitem"}
          aria-label={place.name}
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
