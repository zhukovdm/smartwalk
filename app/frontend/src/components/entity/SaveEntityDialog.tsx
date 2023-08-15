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
import { AppContext } from "../../App";
import { ExtendedPlace } from "../../domain/types";
import { IdGenerator } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { createFavouritePlace } from "../../features/favouritesSlice";
import { setBlock } from "../../features/panelSlice";

type SaveEntityDialogProps = {

  /** An entity to be saved. */
  entity: ExtendedPlace;

  /** Action hiding the dialog. */
  onHide: () => void;
};

/**
 * Dialog with the user for saving an entity.
 */
export default function SaveEntityDialog({ entity, onHide }: SaveEntityDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { block } = useAppSelector(state => state.panel);

  const [name, setName] = useState(entity.name);

  const saveAction = async (): Promise<void> => {
    dispatch(setBlock(true));
    try {
      const pl = { name: name, location: entity.location, keywords: entity.keywords, selected: [] };
      const st = {
        ...pl,
        grainId: entity.smartId,
        placeId: IdGenerator.generateId(pl)
      };
      await storage.createPlace(st);
      dispatch(createFavouritePlace(st));
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save place</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth="450px">
            <Typography fontSize="small" color="grey">
              Save operation creates a <strong>local</strong> reference (object with a name,
              location, and keywords). Such references are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={block} onClick={onHide} color="error">Discard</Button>
            <Button disabled={block || !(name.trim().length > 0)} onClick={() => { saveAction(); }}>Save</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
