import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { setDialogBlock } from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { SomethingKind } from "../shared/_types";
import SaveSomethingDialogActions from "../shared/SomethingSaveDialogActions";

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
          <Typography>Enter new name:</Typography>
          <TextField
            fullWidth
            size={"small"}
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
        </Stack>
      </DialogContent>
      <SaveSomethingDialogActions
        disableSave={!(name.trim().length > 0)}
        loadingSave={dialogBlock}
        discardAction={() => { discardAction(); }}
        saveAction={() => { saveAction(); }}
      />
    </Dialog>
  );
}