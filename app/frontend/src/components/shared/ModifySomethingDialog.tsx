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

type ModifySomethingDialogProps = {

  show: boolean;

  what: "route" | "direction";

  onHide: () => void;

  onModify: () => void;
};

export default function ModifySomethingDialog(
  { show, what, onHide, onModify }: ModifySomethingDialogProps): JSX.Element {

  const confirmAction = async () => {
    onModify();
    onHide();
  };

  const icon = <Directions
    fontSize={"small"}
    className={"stored-direc"}
    sx={{ verticalAlign: "middle" }}
  />

  return (
    <Dialog open={show}>
      <DialogTitle>Modify {what}</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2} maxWidth={"300px"}>
          <Typography>
            The action will <strong>replace</strong> points in the {icon} search panel and <strong>navigate</strong> you there.
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
          title={"Replace points"}
          onClick={() => { confirmAction(); }}
        >
          <span>Confirm</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
