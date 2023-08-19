import { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { AppContext } from "../../App";
import { ExtendedPlace } from "../../domain/types";
import { IdGenerator } from "../../utils/helpers";
import { createFavoritePlace } from "../../features/favoritesSlice";
import { useAppDispatch } from "../../features/storeHooks";

type SavePlaceDialogProps = {

  /** Determine whether the dialog is shown. */
  show: boolean;

  /** A place to be saved. */
  place: ExtendedPlace;

  /** Action hiding the dialog. */
  onHide: () => void;
};

/**
 * Dialog with the user for saving a place.
 */
export default function SavePlaceDialog(
  { show, place, onHide }: SavePlaceDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);

  const [name, setName] = useState(place.name);
  const [loading, setLoading] = useState(false);

  const discardAction = (): void => {
    setName(place.name);
    onHide();
  };

  const saveAction = async (): Promise<void> => {
    setLoading(true);
    try {
      const pl = {
        name: name,
        location: place.location,
        keywords: place.keywords,
        categories: []
      };
      const st = {
        ...pl,
        smartId: place.smartId,
        placeId: IdGenerator.generateId(pl)
      };
      await storage.createPlace(st);
      dispatch(createFavoritePlace(st));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={show}>
      <DialogTitle>Save place</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth={"450px"}>
            <Typography color={"grey"} fontSize={"small"}>
              Save operation creates a <strong>local copy</strong> of the object (with name,
              location, and keywords). Such copies are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Button
              color={"error"}
              disabled={loading}
              onClick={discardAction}
            >
              <span>Discard</span>
            </Button>
            <LoadingButton
              disabled={!(name.trim().length > 0)}
              loading={loading}
              startIcon={<Save />}
              onClick={() => { saveAction(); }}
            >
              <span>Save</span>
            </LoadingButton>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
