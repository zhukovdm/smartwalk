import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SomethingKind } from "../../domain/types";
import { setDialogBlock } from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import SomethingSaveDialogActions from "../_shared/SomethingSaveDialogActions";

type EditSomethingDialogProps = {

  /** Old name of `something`. */
  name: string;

  /** Opens dialog window. */
  show: boolean;

  /** A kind of `something`. */
  what: SomethingKind;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action saving modified `something`. */
  onSave: (name: string) => Promise<void>;
};

/**
 * Dialog for editing and saving edited `something`.
 */
export default function EditSomethingDialog(
  { name: oldName, show, what, onHide, onSave }: EditSomethingDialogProps): JSX.Element {

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
      <DialogTitle>Edit {what}</DialogTitle>
      <DialogContent>
        <Stack
          direction={"column"}
          gap={2}
          sx={{ width: "300px", maxWidth: "100%" }}
        >
          <Typography>Modify data items, and press Save.</Typography>
          <TextField
            label={"Name"}
            required={true}
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
        discardAction={() => { discardAction(); }}
        saveAction={() => { saveAction(); }}
      />
    </Dialog>
  );
}
