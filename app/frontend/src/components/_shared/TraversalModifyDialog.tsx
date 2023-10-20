import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import type { TraversalKind } from "../../domain/types";

export type TraversalModifyDialogProps = {

  /** Show dialog */
  show: boolean;

  /** Kind of a `traversable` */
  what: TraversalKind;

  /** Callback hiding dialog */
  onHide: () => void;

  /** Callback confirming modification */
  onModify: () => void;
};

/**
 * Dialog that replaces direction sequence by points of a route, or direction
 * from a result or stored one.
 */
export default function TraversalModifyDialog(
  { show, what, onHide, onModify }: TraversalModifyDialogProps): JSX.Element {

  const confirmAction = async () => {
    onModify();
    onHide();
  };

  return (
    <Dialog
      aria-label={`Modify ${what}`}
      open={show}
      onClose={onHide}
    >
      <DialogTitle
        aria-label={`Modify ${what}`}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>Modify {what}</span>
        <IconButton
          size={"small"}
          title={"Hide dialog"}
          onClick={onHide}
        >
          <CloseIcon fontSize={"small"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2} maxWidth={"300px"}>
          <Typography>
            This action will <em>replace</em> points in the {<DirectionsIcon fontSize={"small"} className={"action-place"} sx={{ verticalAlign: "middle" }} />} search panel and <em>navigate</em> you there.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          color={"error"}
          onClick={onHide}
        >
          <span>Cancel</span>
        </Button>
        <Button
          onClick={() => { confirmAction(); }}
        >
          <span>Confirm</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
