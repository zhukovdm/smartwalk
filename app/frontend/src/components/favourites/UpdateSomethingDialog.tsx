import { useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { SomethingKind } from "../shared/types";
import { setBlock } from "../../features/panelSlice";

type UpdateSomethingDialogProps = {

  /** Old name of `something`. */
  name: string;

  /** `Something` that will be updated. */
  what: SomethingKind;

  /** Callback for hiding the dialog. */
  onHide: () => void;

  /** Callback performing `update`. */
  onUpdate: (name: string) => Promise<void>;
};

/**
 * Dialog for updating named `something`.
 */
export default function UpdateSomethingDialog({ name: oldName, what, onHide, onUpdate }: UpdateSomethingDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { block } = useAppSelector(state => state.panel);

  const [name, setName] = useState(oldName);

  const updateAction = async () => {
    dispatch(setBlock(true));
    try {
      await onUpdate(name);
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Update {what}</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <Typography>Enter new name:</Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", minWidth: "300px" }}>
            <Button disabled={block} onClick={onHide} color="error">Discard</Button>
            <Button disabled={block || !(name.trim().length > 0)} onClick={() => { updateAction(); }}>Update</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
