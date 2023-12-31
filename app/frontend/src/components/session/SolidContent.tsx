import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppContext } from "../../App";
import { FAVORITES_ADDR } from "../../utils/routing";
import { resetFavorites } from "../../features/favoritesSlice";
import { setBlock, setDialogBlock } from "../../features/panelSlice";
import {
  activateSolid,
  setSolidAvailablePods,
  setSolidSelectedPod
} from "../../features/solidSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import SolidStorage from "../../utils/solidStorage";
import {
  getAvailableSolidPods,
  solidLogout
} from "../../utils/solidProvider";

/**
 * The content of the Solid panel upon login.
 */
export default function SolidContent(): JSX.Element {

  const navigate = useNavigate();
  const context = useContext(AppContext);

  const dispatch = useAppDispatch();
  const {
    block,
    dialogBlock
  } = useAppSelector((state) => state.panel);

  const {
    activated,
    availablePods,
    selectedPod,
    webId
  } = useAppSelector((state) => state.solid);

  useEffect(() => {
    const load = async () => {
      if (!availablePods) {
        try {
          const pods = await getAvailableSolidPods(webId);
          dispatch(setSolidAvailablePods(pods));
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [dispatch, webId, availablePods]);

  const [pod, setPod] = useState<string | null>(selectedPod);

  const activateAction = async (): Promise<void> => {
    dispatch(setDialogBlock(true));
    try {
      const p = pod!;
      const s = new SolidStorage(p);

      await s.init();
      context.storage = s;

      dispatch(activateSolid());
      dispatch(resetFavorites());
      dispatch(setSolidSelectedPod(p));
      navigate(FAVORITES_ADDR);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setDialogBlock(false));
    }
  };

  const logoutAction = async (): Promise<void> => {
    dispatch(setBlock(true));
    try {
      await solidLogout();
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Stack direction={"column"} gap={2}>
      <Stack direction={"column"} gap={1}>
        <Typography>You are logged in with WebID:</Typography>
        <Typography align={"center"}>
          <Link
            href={webId}
            title={"Web Identity and Discovery"}
            noWrap={true}
          >
            {webId}
          </Link>
        </Typography>
      </Stack>
      <Stack direction={"column"} gap={2}>
        <Typography>
          Select a Pod that should act as a storage:
        </Typography>
        <Autocomplete
          size={"small"}
          value={pod}
          loading={!availablePods}
          options={availablePods ?? []}
          disabled={block || dialogBlock || !!selectedPod}
          onChange={(_, v) => { setPod(v); }}
          getOptionLabel={(option) => option ?? ""}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"PodId"}
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {!availablePods ? <CircularProgress color={"inherit"} size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                )
              }}
            />
          )}
          renderOption={(props, option) => (<li {...props} key={option}>{option}</li>)}
        />
      </Stack>
      <Stack gap={1}>
        <Stack direction={"row"} justifyContent={"center"}>
          <Button
            disabled={block || dialogBlock || !!selectedPod || !pod || activated}
            onClick={activateAction}
          >
            <span>Activate Pod</span>
          </Button>
        </Stack>
        <Typography fontSize={"small"}>
          After activation, you will be redirected to Favorites. Only data from your Solid Pod will appear there. Device storage will be available immediately upon logout. Storages are not synced.
        </Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"center"}>
        <LoadingButton
          disabled={dialogBlock}
          loading={block}
          loadingPosition={"start"}
          startIcon={<LogoutIcon />}
          color={"error"}
          onClick={logoutAction}
        >
          <span>Log out</span>
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
