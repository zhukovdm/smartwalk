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
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../features/store";
import { setDialogBlock } from "../../features/panelSlice";
import { SomethingKind } from "../shared/types";

type UpdateSomethingDialogProps = {

  /** Opens dialog window. */
  show: boolean;

  /** Old name of `something`. */
  name: string;

  /** A kind of `something`. */
  what: SomethingKind;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action updating `something` from the current storage. */
  onUpdate: (name: string) => Promise<void>;
};

/**
 * Dialog for updating named `something`.
 */
export default function UpdateSomethingDialog({ name: oldName, what, onHide, onUpdate }: UpdateSomethingDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector(state => state.panel);

  const [name, setName] = useState(oldName);

  const cancelAction = async () => {
    setName(oldName);
    onHide();
  };

  const updateAction = async () => {
    dispatch(setDialogBlock(true));
    try {
      await onUpdate(name);
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setDialogBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Update {what}</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <Typography>Enter new name:</Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            sx={{ minWidth: "300px" }}
          >
            <Button
              color={"error"}
              disabled={dialogBlock}
              onClick={() => { cancelAction(); }}
            >
              <span>Cancel</span>
            </Button>
            <LoadingButton
              disabled={!(name.trim().length > 0)}
              loading={dialogBlock}
              startIcon={<Save />}
              variant={"contained"}
              onClick={() => { updateAction(); }}
            >
              <span>Update</span>
            </LoadingButton>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
