import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import PersonIcon from "@mui/icons-material/Person";
import { setDialogBlock } from "../../features/panelSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import {
  getSolidIdProviders,
  solidLogin
} from "../../utils/solidProvider";
import SolidPodLink from "./SolidPodLink";

export type SolidLoginDialogProps = {

  /** Show/hide dialog. */
  show: boolean;

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Dialog allowing to select a Solid Pod provider and log in against it.
 */
export default function SolidLoginDialog(
  { show, onHide }: SolidLoginDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector((state) => state.panel);

  const https = "https://";
  const [provider, setProvider] = useState(https);

  useEffect(() => { if (!show) { setProvider(https); } }, [show]);

  const isLink = (link: string) => {
    try {
      new URL(link);
      return true;
    }
    catch (_) { return false; }
  };

  const loginAction = async () => {
    dispatch(setDialogBlock(true));
    try {
      await solidLogin(provider);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setDialogBlock(false));
    }
  };

  return (
    <Dialog open={show}>
      <DialogTitle>Solid session</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Typography>
            Enter an address of your <SolidPodLink /> provider.
          </Typography>
          <Autocomplete
            freeSolo
            size={"small"}
            disabled={dialogBlock}
            value={provider}
            onInputChange={(_, v) => { setProvider(v); }}
            options={getSolidIdProviders()}
            renderInput={(params) => (
              <TextField {...params} label={"Url"} />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          color={"error"}
          disabled={dialogBlock}
          onClick={onHide}
        >
          <span>Discard</span>
        </Button>
        <LoadingButton
          disabled={!isLink(provider)}
          loading={dialogBlock}
          loadingPosition={"start"}
          onClick={loginAction}
          startIcon={<PersonIcon />}
        >
          <span>Log in</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
