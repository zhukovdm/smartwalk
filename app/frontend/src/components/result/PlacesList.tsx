import { useContext } from "react";
import { Stack } from "@mui/material";
import { AppContext } from "../../App";
import { StoredPlace, UiPlace } from "../../domain/types";
import { FixedPlaceListItem } from "../shared/_list-items";

type PlacesListProps = {

  /** List of places. */
  places: UiPlace[];

  /** Known places with smartId appearing in the storage. */
  smarts: Map<string, StoredPlace>;
};

/**
 * List of places obtained in the result (with replacement).
 */
export default function PlacesList({ places, smarts }: PlacesListProps): JSX.Element {

  const { map } = useContext(AppContext);

  return (
    <Stack direction={"column"} gap={2}>
      {places
        .map((place, i) => {
          const sid = place.smartId!;
          const smart = smarts.get(sid);
          return (smart)
            ? <FixedPlaceListItem
                key={i}
                kind={"stored"}
                label={smart.name}
                smartId={sid}
                title={"Fly to"}
                onPlace={() => { map?.flyTo(smart); }}
              />
            : <FixedPlaceListItem
                key={i}
                kind={"common"}
                label={place.name}
                smartId={sid}
                title={"Fly to"}
                onPlace={() => { map?.flyTo(place); }}
              />
        })
      }
    </Stack>
  );
}
