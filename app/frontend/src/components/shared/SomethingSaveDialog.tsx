import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { SomethingKind } from "./_types";
import { setDialogBlock } from "../../features/panelSlice";
import SaveSomethingDialogActions from "./SomethingSaveDialogActions";

type SaveSomethingDialogProps = {

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
export default function SaveSomethingDialog(
  { name: oldName, show, what, onHide, onSave }: SaveSomethingDialogProps): JSX.Element {

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
          <Typography>Enter a name:</Typography>
          <TextField
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
      <SaveSomethingDialogActions
        disableSave={!(name.trim().length > 0)}
        loadingSave={dialogBlock}
        discardAction={discardAction}
        saveAction={() => { saveAction(); }}
      />
    </Dialog>
  );
}
