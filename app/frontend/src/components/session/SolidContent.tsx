import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppContext } from "../../App";
import { FAVORITES_ADDR } from "../../domain/routing";
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
import SolidProvider from "../../utils/solidProvider";
import { LoadingButton } from "@mui/lab";

/**
 * The content of the Solid panel upon login.
 */
export default function SolidContent(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const context = useContext(AppContext);
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
          const pods = await SolidProvider.getAvailablePods(webId);
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
      await SolidProvider.logout();
      navigate(FAVORITES_ADDR);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Stack direction={"column"} gap={2}>
      <Stack direction={"column"} gap={1}>
        <Typography>You are logged in with WebId:</Typography>
        <Typography align={"center"}>
          <Link
            href={webId}
            rel={"noopener noreferrer"}
            target={"_blank"}
            title={"Solid Web Identity"}
            underline={"hover"}
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
        <Typography>
          Activate the Pod and redirect to <FavoriteIcon fontSize={"small"} className={"action-place"} sx={{ verticalAlign: "middle" }} titleAccess={"Favorites"} />:
        </Typography>
        <Stack direction={"row"} justifyContent={"center"}>
          <Button
            disabled={block || dialogBlock || !!selectedPod || !pod || activated}
            onClick={activateAction}
            title={"Activate and redirect to Favorites"}
          >
            <span>Activate</span>
          </Button>
        </Stack>
        <Typography fontSize={"small"}>
          After activating, only data from your Solid Pod will appear in Favorites. Local storage will be available immediately upon logout. Storages are not synced.
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
          title={"Log out from your Solid Web Identity"}
        >
          <span>Logout</span>
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
