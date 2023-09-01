import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

export type SomethingSaveDialogActionsProps = {

  /** Flag preventing erroneous save. */
  disableSave: boolean;

  /** Flag indicating save in progress. */
  loadingSave: boolean;

  /** Cleanup on discard. */
  discardAction: () => void;

  /** Save procedure. */
  saveAction: () => void;
};

/**
 * Actions for `places`, `routes`, and `directions` save dialog.
 */
export default function SomethingSaveDialogActions(
  { disableSave, loadingSave, saveAction, discardAction }: SomethingSaveDialogActionsProps): JSX.Element {

  return (
    <DialogActions
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Button
        color={"error"}
        disabled={loadingSave}
        onClick={discardAction}
      >
        <span>Discard</span>
      </Button>
      <LoadingButton
        disabled={disableSave}
        loading={loadingSave}
        loadingPosition={"start"}
        startIcon={<SaveIcon />}
        onClick={saveAction}
      >
        <span>Save</span>
      </LoadingButton>
    </DialogActions>
  );
}
