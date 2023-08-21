import { Stack } from "@mui/material";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { FixedPlaceListItem } from "../shared/_list-items";

type ResultDirecsContentListProps = {
  map: IMap | undefined;
  places: UiPlace[];
};

export default function ResultDirecsContentList(
  { map, places }: ResultDirecsContentListProps): JSX.Element {

  return (
    <Stack gap={2}>
      {places
        .map((place, i) => (
          <FixedPlaceListItem
            key={i}
            kind={!!place.placeId ? "stored" : "common"}
            label={place.name}
            smartId={place.smartId}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(place); }}
          />
        ))
      }
    </Stack>
  );
}
