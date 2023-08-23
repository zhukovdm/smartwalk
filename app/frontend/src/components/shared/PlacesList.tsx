import { Stack } from "@mui/material";
import { UiPlace } from "../../domain/types";
import { FixedPlaceListItem } from "./_list-items";
import { IMap } from "../../domain/interfaces";

type PlacesListProps = {

  map: IMap | undefined;

  /** List of places. */
  places: UiPlace[];
};

/**
 * List of places obtained in the result (with replacement).
 */
export default function PlacesList({ map, places }: PlacesListProps): JSX.Element {

  return (
    <Stack direction={"column"} gap={2}>
      {places.map((place, i) => (
        <FixedPlaceListItem
          key={i}
          kind={!!place.placeId ? "stored" : "common"}
          label={place.name}
          smartId={place.smartId}
          title={"Fly to"}
          onPlace={() => { map?.flyTo(place); }}
        />
      ))}
    </Stack>
  );
}
