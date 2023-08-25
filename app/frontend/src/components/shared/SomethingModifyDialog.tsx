import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";

type SomethingModifyDialogProps = {

  show: boolean;

  what: "route" | "direction";

  onHide: () => void;

  onModify: () => void;
};

export default function SomethingModifyDialog(
  { show, what, onHide, onModify }: SomethingModifyDialogProps): JSX.Element {

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
