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
import { WgsPoint, UiPlace, StoredPlace } from "../../domain/types";
import { point2place } from "../../utils/helpers";
import {
  hidePanel,
  setDialogBlock,
  showPanel
} from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
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
 * Component showing a dialog for selecting a place, either stored
 * or user-defined.
 */
export default function SelectPlaceDialog(
  { show, kind, onHide, onSelect }: SelectPlaceDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  const { dialogBlock } = useAppSelector((state) => state.panel);

  // custom place

  const callback = (point: WgsPoint) => {
    onSelect(point2place(point));
    dispatch(showPanel());
    dispatch(setDialogBlock(false));
  };

  const handleCustom = () => {
    onHide();
    dispatch(hidePanel());
    dispatch(setDialogBlock(true));
    map?.captureLocation(callback);
  };

  // stored place

  const [place, setPlace] = useState<StoredPlace | null>(null);
  const { loaded, places } = useAppSelector((state) => state.favorites);

  const handleFavorites = () => {
    setPlace(null);
    onSelect(place!);
    onHide();
  };

  return (
    <Dialog
      aria-label={"Select point"}
      open={show}
      onClose={onHide}
    >
      <DialogTitle
        aria-label={"Select point"}
        sx={{ display: "flex", justifyContent: "space-between" }}
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
          Click <AddPlaceButton disabled={dialogBlock} kind={kind} title={"Select location"} onPlace={handleCustom} /> to select a point on the map.
        </Typography>
        <Divider>
          <Typography>OR</Typography>
        </Divider>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          <Typography>
            Select a place from <b>Favorites</b> and confirm.
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
                label={"Place"}
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
              onClick={() => { handleFavorites(); }}
            >
              <span>Confirm</span>
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
