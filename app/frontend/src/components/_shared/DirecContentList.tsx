import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import InformPlaceListItem from "./InformPlaceListItem";

type DirecContentListProps = {

  /** Current map */
  map: IMap | undefined;

  /** Places on the direction */
  places: UiPlace[];
};

/**
 * List of direction waypoints shown in the Result or Viewer panel.
 */
export default function DirecContentList(
  { map, places }: DirecContentListProps): JSX.Element {

  return (
    <Stack gap={2}>
      {places
        .map((place, i) => (
          <InformPlaceListItem
            key={i}
            place={place}
            kind={!!place.placeId ? "stored" : "common"}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(place); }}
          />
        ))
      }
    </Stack>
  );
}
