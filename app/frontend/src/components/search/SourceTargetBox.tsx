import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Map as IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { useAppDispatch } from "../../features/storeHooks";
import {
  setSearchRoutesSource,
  setSearchRoutesTarget
} from "../../features/searchRoutesSlice";
import RemovablePlaceListItem from "../_shared/RemovablePlaceListItem";
import VacantPlaceListItem from "../_shared/VacantPlaceListItem";
import SelectPointDialog from "./SelectPointDialog";

export type SourceTargetBoxProps = {

  /** Current map */
  map?: IMap;

  /** Starting point */
  source?: UiPlace;

  /** Destination */
  target?: UiPlace;
};

export default function SourceTargetBox(
  { map, source, target }: SourceTargetBoxProps): JSX.Element {

  const dispatch = useAppDispatch();

  const [sourceSelectDialog, setSourceSelectDialog] = useState(false);
  const [targetSelectDialog, setTargetSelectDialog] = useState(false);

  const swapAction = () => {
    dispatch(setSearchRoutesSource(target));
    dispatch(setSearchRoutesTarget(source));
  };

  return (
    <Stack
      direction={"column"}
      gap={1}
    >
      <Stack
        direction={"column"}
        gap={2}
      >
        <Box
          role={"region"}
          aria-label={"Starting point"}
        >
          {(!source)
            ? <VacantPlaceListItem
                kind={"source"}
                label={"Select starting point..."}
                title={"Select starting point"}
                onClick={() => { setSourceSelectDialog(true); }}
              />
            : <RemovablePlaceListItem
                kind={"source"}
                place={source}
                title={"Fly to"}
                onPlace={() => { map?.flyTo(source); }}
                onRemove={() => { dispatch(setSearchRoutesSource(undefined)); }}
              />
          }
          <SelectPointDialog
            show={sourceSelectDialog}
            kind={"source"}
            onHide={() => setSourceSelectDialog(false)}
            onSelect={(place) => dispatch(setSearchRoutesSource(place))}
          />
        </Box>
        <Box
          role={"region"}
          aria-label={"Destination"}
        >
          {(!target)
            ? <VacantPlaceListItem
                kind={"target"}
                label={"Select destination..."}
                title={"Select destination"}
                onClick={() => { setTargetSelectDialog(true); }}
              />
            : <RemovablePlaceListItem
                kind={"target"}
                place={target}
                title={"Fly to"}
                onPlace={() => { map?.flyTo(target); }}
                onRemove={() => { dispatch(setSearchRoutesTarget(undefined)); }}
              />
          }
          <SelectPointDialog
            show={targetSelectDialog}
            kind={"target"}
            onHide={() => setTargetSelectDialog(false)}
            onSelect={(place) => dispatch(setSearchRoutesTarget(place))}
          />
        </Box>
      </Stack>
      <Box
        display={"flex"}
        justifyContent={"center"}
      >
        <Button
          startIcon={<SwapVertIcon />}
          onClick={() => { swapAction(); }}
          sx={{ mt: 1, textTransform: "none" }}
        >
          <span>Swap points</span>
        </Button>
      </Box>
    </Stack>
  );
}
