import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SomethingKind } from "../../domain/types";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { setDialogBlock } from "../../features/panelSlice";
import SomethingSaveDialogActions from "./SomethingSaveDialogActions";

export type SomethingSaveDialogProps = {

  /** An initial name of `something`. */
  name: string;

  /** Opens dialog window. */
  show: boolean;

  /** A kind of `something`. */
  what: SomethingKind;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action saving `something`. */
  onSave: (name: string) => Promise<void>;
};

/**
 * Dialog for saving `something`.
 */
export default function SomethingSaveDialog(
  { name: oldName, show, what, onHide, onSave }: SomethingSaveDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector((state) => state.panel);

  const [name, setName] = useState(oldName);

  const discardAction = (): void => {
    setName(oldName);
    onHide();
  };

  const saveAction = async (): Promise<void> => {
    dispatch(setDialogBlock(true));
    try {
      const newName = name.trim();
      await onSave(newName);
      setName(newName);
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
          sx={{ width: "320px", maxWidth: "100%" }}
        >
          <Typography>Fill in / modify data items, and press Save.</Typography>
          <TextField
            required
            label={"Name"}
            fullWidth
            size={"small"}
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
          <Typography fontSize={"small"}>
            The save operation creates a <strong>local copy</strong> of the object, which is no longer synchronized with the server.
          </Typography>
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
