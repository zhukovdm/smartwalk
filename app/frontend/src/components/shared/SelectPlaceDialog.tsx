import { Fragment, useContext, useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { hidePanel, showPanel } from "../../features/panelSlice";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../../features/favouritesSlice";
import { PlaceKind } from "./types";
import { AddPlaceButton } from "./buttons";

type SelectPlaceDialogProps = {

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
export default function SelectPlaceDialog({ kind, onHide, onSelect }: SelectPlaceDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

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
  const { places, placesLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        try {
          dispatch(setFavouritePlaces(await storage.getAllPlaces()));
          dispatch(setFavouritePlacesLoaded());
        }
        catch (ex) { alert(ex); }
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  const handleFavourites = () => {
    onSelect(place!);
    onHide();
  };

  return (
    <Dialog open onClose={onHide}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>Select a point</span>
        <IconButton size="small" onClick={onHide}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Click <AddPlaceButton kind={kind} size="large" onPlace={handleCustom} /> to select a point.
        </Typography>
        <Divider>
          <Typography>OR</Typography>
        </Divider>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          <Typography>
            Select a place from <b>Favourites</b>.
          </Typography>
          <Autocomplete
            options={places}
            loading={!placesLoaded}
            onChange={(_, v) => { setPlace(v); }}
            getOptionLabel={(option) => option.name ?? ""}
            isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {!placesLoaded ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
            renderOption={(props, option) => (<li {...props} key={option.placeId}>{option.name}</li>)}
          />
          <Box sx={{ mt: 1, display: "flex", justifyContent: "right" }}>
            <Button color="primary" disabled={!place} onClick={() => { handleFavourites(); }}>Confirm</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
