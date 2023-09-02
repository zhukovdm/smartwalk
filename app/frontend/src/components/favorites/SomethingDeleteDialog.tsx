import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { SomethingKind } from "../../domain/types";
import { setDialogBlock } from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";

export type DeleteSomethingDialogProps = {

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
    finally {
      dispatch(setDialogBlock(false));
    }
  };

  return (
    <Dialog open={show}>
      <DialogTitle>Delete {what}</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2} maxWidth={"300px"}>
          <Typography>
            You are about to delete <strong>{name}</strong>. Please confirm the action.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disabled={dialogBlock}
          onClick={onHide}
          title={"Close dialog"}
        >
          <span>Cancel</span>
        </Button>
        <LoadingButton
          color={"error"}
          loading={dialogBlock}
          loadingPosition={"start"}
          title={"Send request"}
          startIcon={<DeleteIcon />}
          onClick={() => { deleteAction(); }}
        >
          <span>Delete</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
