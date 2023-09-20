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

  // custom place

  const callback = (point: WgsPoint) => {
    onSelect(point2place(point));
    dispatch(showPanel());
  };

  const handleLocation = () => {
    onHide();
    dispatch(hidePanel());
    map?.captureLocation(callback);
  };

  // stored place

  const [place, setPlace] = useState<StoredPlace | null>(null);
  const { loaded, places } = useAppSelector((state) => state.favorites);

  const handleFavorites = () => {
    if (!!place) {
      setPlace(null);
      onSelect(place);
      onHide();
    }
  };

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
          Click <AddLocationButton kind={kind} onClick={handleLocation} /> to select a point on the map.
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
