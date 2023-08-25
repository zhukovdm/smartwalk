import Stack from "@mui/material/Stack";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { FixedPlaceListItem } from "./_list-items";
import PlacesList from "./PlacesList";

type RouteContentListProps = {
  map: IMap | undefined;
  source: UiPlace;
  target: UiPlace;
  places: UiPlace[];
  filterList: boolean[];
};

export default function RouteContentList(
  { map, source, target, places, filterList }: RouteContentListProps): JSX.Element {

  return (
    <Stack gap={2}>
      <FixedPlaceListItem
        title={"Fly to"}
        kind={"source"}
        label={source.name}
        onPlace={() => { map?.flyTo(source); }}
      />
      {filterList.some((f) => f) && (
        <PlacesList
          map={map}
          places={places}
        />
      )}
      <FixedPlaceListItem
        title={"Fly to"}
        kind={"target"}
        label={target.name}
        onPlace={() => { map?.flyTo(target); }}
      />
    </Stack>
  );
}
