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

type TraversableModifyDialogProps = {

  /** Show/hide dialog */
  show: boolean;

  /** Kind of `traversable` */
  what: "route" | "direction";

  /** Callback hiding dialog */
  onHide: () => void;

  /** Callback upon confirmation */
  onModify: () => void;
};

export default function TraversableModifyDialog(
  { show, what, onHide, onModify }: TraversableModifyDialogProps): JSX.Element {

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
        sx={{ display: "flex", justifyContent: "space-between" }}
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
            This action will <strong>replace</strong> points in the {<DirectionsIcon fontSize={"small"} className={"action-place"} sx={{ verticalAlign: "middle" }} />} search panel and <strong>navigate</strong> you there.
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
