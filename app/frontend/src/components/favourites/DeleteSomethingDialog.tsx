import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setBlock } from "../../features/panelSlice";
import { SomethingKind } from "../shared/types";

type DeleteSomethingDialogProps = {

  /** Name of the `something`. */
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
export default function DeleteSomethingDialog({ name, what, onHide, onDelete }: DeleteSomethingDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { block } = useAppSelector(state => state.panel);

  const deleteAction = async () => {
    dispatch(setBlock(true));
    try {
      await onDelete();
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Delete {what}</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <Typography>
            You are about to delete <b>{name}</b>. Please confirm the action.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={block} onClick={onHide}>Cancel</Button>
            <Button disabled={block} onClick={() => { deleteAction(); }} color="error">Delete</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
