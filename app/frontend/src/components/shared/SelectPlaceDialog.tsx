import { Fragment, useContext, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AppContext } from "../../App";
import { WgsPoint, UiPlace, StoredPlace } from "../../domain/types";
import { point2place } from "../../utils/helpers";
import { hidePanel, showPanel } from "../../features/panelSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { PlaceKind } from "./_types";
import { AddPlaceButton } from "./_buttons";

type SelectPlaceDialogProps = {

  /** Set to open dialog. */
  show: boolean;

  /** Place kind (source, target, etc.) */
  kind: PlaceKind;

  /** Action hiding dialog. */
  onHide: () => void;

  /** Dispatch selected place to the state. */
  onSelect: (place: UiPlace) => void;
};

/**
 * Component showing a dialog for selecting a place, either stored or user-defined.
 */
export default function SelectPlaceDialog(
  { show, kind, onHide, onSelect }: SelectPlaceDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  // custom place

  const callback = (point: WgsPoint) => {
    onSelect(point2place(point));
    dispatch(showPanel());
  };

  const handleCustom = () => {
    onHide();
    dispatch(hidePanel());
    map?.captureLocation(callback);
  };

  // stored place

  const [place, setPlace] = useState<StoredPlace | null>(null);
  const { loaded, places } = useAppSelector((state) => state.favorites);

  const handleFavourites = () => {
    onSelect(place!);
    onHide();
  };

  return (
    <Dialog open={show} onClose={onHide}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>Select a point</span>
        <IconButton size={"small"} onClick={onHide}>
          <Close fontSize={"small"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Click <AddPlaceButton kind={kind} size={"large"} onPlace={handleCustom} /> to select a point.
        </Typography>
        <Divider>
          <Typography>OR</Typography>
        </Divider>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          <Typography>
            Select a place from <b>Favorites</b>.
          </Typography>
          <Autocomplete
            loading={!loaded}
            onChange={(_, v) => { setPlace(v); }}
            options={places}
            size={"small"}
            getOptionLabel={(option) => option.name ?? ""}
            isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {!loaded ? <CircularProgress color={"inherit"} size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
            renderOption={(props, option) => (<li {...props} key={option.placeId}>{option.name}</li>)}
          />
          <Box sx={{ mt: 1, display: "flex", justifyContent: "right" }}>
            <Button
              color={"primary"}
              disabled={!place}
              onClick={() => { handleFavourites(); }}
            >
              <span>Confirm</span>
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
