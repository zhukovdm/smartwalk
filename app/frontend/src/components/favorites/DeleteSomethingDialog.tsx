import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../features/store";
import { setDialogBlock } from "../../features/panelSlice";
import { SomethingKind } from "../shared/_types";

type DeleteSomethingDialogProps = {

  /** Opens dialog window. */
  show: boolean;

  /** Name of `something`. */
  name: string;

  /** A kind of `something`. */
  what: SomethingKind;

  /** Action hiding the dialog. */
  onHide: () => void;

  /** Action deleting `something` from the current storage. */
  onDelete: () => Promise<void>;
};

/**
 * Dialog for deleting named `something`.
 */
export default function DeleteSomethingDialog(
  { show, name, what, onHide, onDelete }: DeleteSomethingDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector((state) => state.panel);

  const deleteAction = async () => {
    dispatch(setDialogBlock(true));
    try {
      await onDelete();
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setDialogBlock(false)); }
  };

  return (
    <Dialog open={show}>
      <DialogTitle>Delete {what}</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <Typography>
            You are about to delete <strong>{name}</strong>.
            Please confirm the action.
          </Typography>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Button
              disabled={dialogBlock}
              onClick={onHide}
            >
              <span>Cancel</span>
            </Button>
            <LoadingButton
              color={"error"}
              loading={dialogBlock}
              startIcon={<Delete />}
              variant={"contained"}
              onClick={() => { deleteAction(); }}
            >
              <span>Delete</span>
            </LoadingButton>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}