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
import { UiDirec } from "../../domain/types";
import { IdGenerator } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { createFavouriteDirec } from "../../features/favouritesSlice";
import { setResultDirecs } from "../../features/resultDirecsSlice";
import { setBlock } from "../../features/panelSlice";

type SaveDirecDialogProps = {

  /** Direction to be saved. */
  direc: UiDirec;

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Dialog for saving a direction appeared in the result.
 */
export default function SaveDirecDialog({ direc, onHide }: SaveDirecDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { block } = useAppSelector(state => state.panel);

  const [name, setName] = useState(direc.name);

  const saveAction = async (): Promise<void> => {
    dispatch(setBlock(true));
    try {
      const dr = { ...direc, name: name };
      const sd = {
        ...dr,
        direcId: IdGenerator.generateId(dr)
      };
      await storage.createDirec(sd);
      dispatch(createFavouriteDirec(sd));
      dispatch(setResultDirecs(sd));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save direction</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <TextField
            value={name}
            sx={{ mt: 0.5 }}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth="350px">
            <Typography fontSize="small" color="grey">
              Save operation creates a <strong>local</strong> copy of this
              direction. Local copies are no longer synchronized with the server.
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
