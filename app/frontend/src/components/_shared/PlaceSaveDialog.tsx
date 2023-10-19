import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { setDialogBlock } from "../../features/panelSlice";
import SomethingSaveDialogActions from "./SomethingSaveDialogActions";

export type PlaceSaveDialogProps = {

  /** An initial name of `something`. */
  name: string;

  /** Opens dialog window. */
  show: boolean;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action saving `something`. */
  onSave: (name: string) => Promise<void>;
};

/**
 * Dialog for saving a place.
 */
export default function PlaceSaveDialog(
  { name: oldName, show, onHide, onSave }: PlaceSaveDialogProps): JSX.Element {

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
      <DialogTitle>Save place</DialogTitle>
      <DialogContent>
        <Stack
          direction={"column"}
          gap={2}
          sx={{ width: "350px", maxWidth: "100%" }}
        >
          <Typography>Set data items as required, and then click Save.</Typography>
          <TextField
            required
            label={"Name"}
            fullWidth
            size={"small"}
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
          <Typography fontSize={"small"}>
            The save operation creates a <strong>partial copy</strong> with a link to the original entity.
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
