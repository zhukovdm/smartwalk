import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import SolidProvider from "../../utils/solidProvider";
import { setDialogBlock } from "../../features/panelSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import SolidPodLink from "./SolidPodLink";

type SolidLoginDialogProps = {

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Dialog allowing to select a Solid Pod provider and log in against it.
 */
export default function SolidLoginDialog({ onHide }: SolidLoginDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { dialogBlock } = useAppSelector((state) => state.panel);

  const https = "https://";
  const [provider, setProvider] = useState(https);

  const loginAction = async () => {
    dispatch(setDialogBlock(true));
    try {
      await SolidProvider.login(provider);
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setDialogBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Solid login</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Typography>
            Enter an address of your <SolidPodLink /> provider.
          </Typography>
          <Autocomplete
            freeSolo
            size={"small"}
            value={provider}
            disabled={dialogBlock}
            options={SolidProvider.getIdProviders()}
            onChange={(_, v) => { setProvider(v ?? ""); }}
            renderInput={(params) => (<TextField {...params} />)}
          />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Button
              disabled={dialogBlock}
              onClick={onHide}
              color={"secondary"}
            >
              <span>Cancel</span>
            </Button>
            <Button
              disabled={dialogBlock || !(provider.length > 0)}
              onClick={loginAction}
            >
              <span>Login</span>
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
