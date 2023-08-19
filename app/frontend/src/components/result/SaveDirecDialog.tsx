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
import { createFavoriteDirec } from "../../features/favoritesSlice";
import { setBlock } from "../../features/panelSlice";
import { updateResultDirec } from "../../features/resultDirecsSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";

type SaveDirecDialogProps = {

  /** Direction to be saved. */
  direc: UiDirec;

  /** Position of the route in the list. */
  index: number;

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Dialog for saving a direction appeared in the result.
 */
export default function SaveDirecDialog(
  { direc, index, onHide }: SaveDirecDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { block } = useAppSelector(state => state.panel);

  const [name, setName] = useState(direc.name);

  const saveAction = async (): Promise<void> => {
    try {
      dispatch(setBlock(true));
      const dr = { ...direc, name: name };
      const sd = {
        ...dr,
        direcId: IdGenerator.generateId(dr)
      };
      await storage.createDirec(sd);
      dispatch(createFavoriteDirec(sd));
      dispatch(updateResultDirec({ direc: sd, index: index }));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Dialog open>
      <DialogTitle>Save direction</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <TextField
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 0.5 }}
            value={name}
          />
          <Box maxWidth={"350px"}>
            <Typography fontSize={"small"} color={"grey"}>
              Save operation creates a <strong>local copy</strong> of this
              direction. Those are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Button
              color={"error"}
              disabled={block}
              onClick={onHide}
            >
              <span>Discard</span>
            </Button>
            <Button
              disabled={block || !(name.trim().length > 0)}
              onClick={() => { saveAction(); }}
            >
              <span>Save</span>
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
