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
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setBlock } from "../../features/panelSlice";
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
  const { block } = useAppSelector(state => state.panel);

  const https = "https://";
  const [provider, setProvider] = useState(https);

  const loginAction = async () => {
    dispatch(setBlock(true));
    try {
      await SolidProvider.login(provider);
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
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
            size="small"
            value={provider}
            disabled={block}
            options={SolidProvider.getIdProviders()}
            onChange={(_, v) => { setProvider(v ?? ""); }}
            renderInput={(params) => (<TextField {...params} />)}
          />
          <Stack direction="row" justifyContent="space-between">
            <Button disabled={block} onClick={onHide} color="secondary">Cancel</Button>
            <Button disabled={block || !(provider.length > 0)} onClick={loginAction}>Login</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
