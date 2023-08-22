import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { setDialogBlock } from "../../features/panelSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { SomethingKind } from "../shared/_types";

type EditSomethingDialogProps = {

  /** Opens dialog window. */
  show: boolean;

  /** Old name of `something`. */
  name: string;

  /** A kind of `something`. */
  what: SomethingKind;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action updating `something` in the current storage. */
  onSave: (name: string) => Promise<void>;
};

/**
 * Dialog for updating named `something`.
 */
export default function EditSomethingDialog(
  { show, name: oldName, what, onHide, onSave }: EditSomethingDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector((state) => state.panel);

  const [name, setName] = useState(oldName);

  const discardAction = async () => {
    setName(oldName);
    onHide();
  };

  const saveAction = async () => {
    dispatch(setDialogBlock(true));
    try {
      await onSave(name.trim());
      setName(name.trim());
      onHide();
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setDialogBlock(false));
    }
  };

  return (
    <Dialog open={show}>
      <DialogTitle>Edit {what}</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2} minWidth={"300px"}>
          <Typography>Enter new name:</Typography>
          <TextField
            fullWidth
            size={"small"}
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color={"error"}
          disabled={dialogBlock}
          onClick={() => { discardAction(); }}
          title={"Close dialog"}
        >
          <span>Discard</span>
        </Button>
        <LoadingButton
          disabled={!(name.trim().length > 0)}
          loading={dialogBlock}
          title={"Send request"}
          startIcon={<Save />}
          onClick={() => { saveAction(); }}
        >
          <span>Save</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
