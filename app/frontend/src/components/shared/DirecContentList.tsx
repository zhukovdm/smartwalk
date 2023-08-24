import { Stack } from "@mui/material";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { FixedPlaceListItem } from "./_list-items";

type DirecContentListProps = {
  map: IMap | undefined;
  places: UiPlace[];
};

export default function DirecContentList(
  { map, places }: DirecContentListProps): JSX.Element {

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
