import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";
import { Directions } from "@mui/icons-material";

type AppendPlaceDialogProps = {

  show: boolean;

  onHide: () => void;

  onAppend: () => void;
};

export default function AppendPlaceDialog(
  { show, onHide, onAppend }: AppendPlaceDialogProps): JSX.Element {

  const confirmAction = async () => {
    onAppend();
    onHide();
  };

  const icon = <Directions
    fontSize={"small"}
    className={"stored-direc"}
    sx={{ verticalAlign: "middle" }}
  />

  return (
    <Dialog open={show}>
      <DialogTitle>Append place</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2} maxWidth={"300px"}>
          <Typography>
            The action will <strong>append</strong> the point to the {icon} sequence.
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
