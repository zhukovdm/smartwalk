import { useState } from "react";
import Box from "@mui/material/Box";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import RemovablePlaceListItem from "../_shared/RemovablePlaceListItem";
import VacantPlaceListItem from "../_shared/VacantPlaceListItem";
import {
  setSearchPlacesCenter
} from "../../features/searchPlacesSlice";
import { useAppDispatch } from "../../features/storeHooks";
import SelectPointDialog from "./SelectPointDialog";

export type CenterPointBoxProps = {

  /** Current map */
  map?: IMap;

  /** Center point */
  center?: UiPlace;
};

export default function CenterPointBox(
  { map, center }: CenterPointBoxProps): JSX.Element {

  const dispatch = useAppDispatch();
  const [selectDialog, setSelectDialog] = useState(false);

  return (
    <Box
      role={"region"}
      aria-label={"Center point"}
    >
      {(!center)
        ? <VacantPlaceListItem
            kind={"center"}
            label={"Select center point..."}
            title={"Select center point"}
            onClick={() => { setSelectDialog(true); }}
          />
        : <RemovablePlaceListItem
            kind={"center"}
            place={center}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(center); }}
            onRemove={() => { dispatch(setSearchPlacesCenter(undefined)); }}
          />
      }
      <SelectPointDialog
        show={selectDialog}
        kind={"center"}
        onHide={() => { setSelectDialog(false); }}
        onSelect={(place) => { dispatch(setSearchPlacesCenter(place)) }}
      />
    </Box>
  );
}
