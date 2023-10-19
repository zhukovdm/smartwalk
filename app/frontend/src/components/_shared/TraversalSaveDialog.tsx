import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { TraversalKind } from "../../domain/types";
import { setDialogBlock } from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import SomethingSaveDialogActions from "./SomethingSaveDialogActions";

export type TraversalSaveDialogProps = {

  /** Opens dialog window. */
  show: boolean;

  /** A kind of a traversal. */
  what: TraversalKind;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action saving a traversal. */
  onSave: (name: string) => Promise<void>;
};

/**
 * Dialog for saving a traversal.
 */
export default function TraversalSaveDialog(
  { show, what, onHide, onSave }: TraversalSaveDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector((state) => state.panel);

  const [name, setName] = useState("");

  const discardAction = (): void => {
    setName("");
    onHide();
  };

  const saveAction = async (): Promise<void> => {
    dispatch(setDialogBlock(true));
    try {
      await onSave(name.trim());
      onHide();
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setDialogBlock(false));
    }
  };

  return (
    <Dialog open={show}>
      <DialogTitle>Save {what}</DialogTitle>
      <DialogContent>
        <Stack
          direction={"column"}
          gap={2}
          sx={{ width: "350px", maxWidth: "100%" }}
        >
          <Typography>Set data items as required, and then press Save.</Typography>
          <TextField
            required
            label={"Name"}
            fullWidth
            size={"small"}
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
        </Stack>
      </DialogContent>
      <SomethingSaveDialogActions
        disableSave={!(name.trim().length > 0)}
        loadingSave={dialogBlock}
        discardAction={discardAction}
        saveAction={() => { saveAction(); }}
      />
    </Dialog>
  );
}
