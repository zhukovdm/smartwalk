import { Button, DialogActions } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

type SaveSomethingDialogActionsProps = {

  disableSave: boolean;

  loadingSave: boolean;

  discardAction: () => void;

  saveAction: () => void;
};

export default function SaveSomethingDialogActions(
  { disableSave, loadingSave, saveAction, discardAction }: SaveSomethingDialogActionsProps): JSX.Element {

  return (
    <DialogActions
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Button
        color={"error"}
        disabled={loadingSave}
        onClick={discardAction}
        title={"Close dialog"}
      >
        <span>Discard</span>
      </Button>
      <LoadingButton
        disabled={disableSave}
        loading={loadingSave}
        loadingPosition={"start"}
        title={"Send request"}
        startIcon={<Save />}
        onClick={saveAction}
      >
        <span>Save</span>
      </LoadingButton>
    </DialogActions>
  );
}
