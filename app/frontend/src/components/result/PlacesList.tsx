import { useContext } from "react";
import { Stack } from "@mui/material";
import { AppContext } from "../../App";
import { UiPlace } from "../../domain/types";
import { FixedPlaceListItem } from "../shared/_list-items";

type PlacesListProps = {

  /** List of places. */
  places: UiPlace[];
};

/**
 * List of places obtained in the result (with replacement).
 */
export default function PlacesList({ places }: PlacesListProps): JSX.Element {

  const { map } = useContext(AppContext);

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
