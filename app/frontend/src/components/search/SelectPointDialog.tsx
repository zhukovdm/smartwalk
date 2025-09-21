import { Fragment, useContext, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../App";
import {
  WgsPoint,
  UiPlace,
  StoredPlace
} from "../../domain/types";
import { point2place } from "../../utils/functions";
import { hidePanel, showPanel } from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { useSearchedPoints } from "../../features/searchHooks";
import AddLocationButton, {
  type AddLocationButtonKind
} from "./AddLocationButton";

export type SelectPointDialogProps = {

  /** Set to open dialog. */
  show: boolean;

  /** Point kind (source, target, common, etc.) */
  kind: AddLocationButtonKind;

  /** Action hiding dialog. */
  onHide: () => void;

  /** Dispatch selected place to the state. */
  onSelect: (place: UiPlace) => void;
};

/**
 * Component showing a dialog for selecting a point, either stored
 * or user-defined.
 */
export default function SelectPointDialog(
  { show, kind, onHide, onSelect }: SelectPointDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  // point selected on the map

  const selectedCallback = (point: WgsPoint) => {
    onSelect(point2place(point));
    dispatch(showPanel());
  };

  const handleSelected = () => {
    onHide();
    dispatch(hidePanel());
    map?.captureLocation(selectedCallback);
  };

  // point searched using free-form input

  const [searchedInput, setSearchedInput] = useState<string>("");
  const [searchedPoint, setSearchedPoint] = useState<UiPlace | null>(null);

  const {
    loading: searchedLoading,
    options: searchedOptions
  } = useSearchedPoints(searchedInput, searchedPoint);

  const resetSearched = () => {
    setSearchedInput("");
    setSearchedPoint(null);
  };

  const handleSearched = () => {
    if (!!searchedPoint) {
      resetSearched();
      onSelect(searchedPoint);
      onHide();
    }
  };

  // place stored in favorites

  const [favoritePlace, setFavoritePlace] = useState<StoredPlace | null>(null);

  const {
    loaded: favoriteLoaded,
    places: favoritePlaces
  } = useAppSelector((state) => state.favorites);

  const resetFavorite = () => {
    setFavoritePlace(null);
  };

  const handleFavorite = () => {
    if (!!favoritePlace) {
      resetFavorite();
      onSelect(favoritePlace);
      onHide();
    }
  };

  // render

  return (
    <Dialog
      open={show}
      onClose={onHide}
    >
      <DialogTitle
        aria-label={"Select point"}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>Select point</span>
        <IconButton
          size={"small"}
          title={"Hide dialog"}
          onClick={onHide}
        >
          <CloseIcon fontSize={"small"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Click <AddLocationButton kind={kind} onClick={handleSelected} /> to select a point on the map.
        </Typography>
        <Divider>
          <Typography>OR</Typography>
        </Divider>
        <Stack direction={"column"} gap={2} sx={{ mb: 2, mt: 2 }}>
          <Typography>
            Find a place by address using free-form input.
          </Typography>
          <Autocomplete
            value={searchedPoint}
            loading={searchedLoading}
            onInputChange={(_, v) => {
              setSearchedInput(v.trimStart());
            }}
            onChange={(_, v) => { setSearchedPoint(v); }}
            filterOptions={(x) => (x)}
            options={searchedOptions}
            noOptionsText={"No points found"}
            size={"small"}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(o, v) => (
              o.location.lat === v.location.lat && o.location.lon === v.location.lon
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Place"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {searchedLoading
                        ? <CircularProgress color={"inherit"} size={20} />
                        : null
                      }
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.placeId}>{option.name}</li>
            )}
          />
        </Stack>
        <Divider>
          <Typography>OR</Typography>
        </Divider>
        <Stack direction={"column"} gap={2} sx={{ mb: 2, mt: 2 }}>
          <Typography>
            Select a place from <b>Favorites</b> and confirm.
          </Typography>
          <Autocomplete
            loading={!favoriteLoaded}
            onChange={(_, v) => { setFavoritePlace(v); }}
            options={favoritePlaces}
            size={"small"}
            getOptionLabel={(option) => option.name ?? ""}
            isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Place"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {!favoriteLoaded
                        ? <CircularProgress color={"inherit"} size={20} />
                        : null
                      }
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.placeId}>{option.name}</li>
            )}
          />
          <Box sx={{ mt: 1, display: "flex", justifyContent: "right" }}>
            <Button
              color={"primary"}
              disabled={
                (!favoritePlace && !searchedPoint) || (!!favoritePlace && !!searchedPoint)
              }
              onClick={() => {
                if (!!favoritePlace) { handleFavorite(); }
                if (!!searchedPoint) { handleSearched(); }
              }}
            >
              <span>Confirm</span>
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
