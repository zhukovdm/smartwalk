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

type AppendPlaceDialogProps = {

  /** Show/hide dialog */
  show: boolean;

  /** Callback hiding dialog */
  onHide: () => void;

  /** Callback confirming append */
  onAppend: () => void;
};

/**
 * Dialog for appending a random place to the direction sequence.
 */
export default function AppendPlaceDialog(
  { show, onHide, onAppend }: AppendPlaceDialogProps): JSX.Element {

  const confirmAction = async () => {
    onAppend();
    onHide();
  };

  return (
    <Dialog
      aria-label={"Append place"}
      open={show}
      onClose={onHide}
    >
      <DialogTitle
        aria-label={"Append place"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Append place</span>
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
            This action will <strong>append</strong> the point to the <DirectionsIcon titleAccess={"direction"} fontSize={"small"} className={"action-place"} sx={{ verticalAlign: "middle" }} /> sequence.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color={"error"}
          onClick={onHide}
          title={"Close dialog"}
        >
          <span>Cancel</span>
        </Button>
        <Button
          title={"Append place"}
          onClick={() => { confirmAction(); }}
        >
          <span>Confirm</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
