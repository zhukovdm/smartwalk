import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { FAVORITES_ADDR } from "../../domain/routing";
import SolidStorage from "../../utils/solidStorage";
import SolidProvider from "../../utils/solidProvider";
import { resetFavorites } from "../../features/favoritesSlice";
import { setBlock } from "../../features/panelSlice";
import { activateSolid, setSolidAvailablePods } from "../../features/solidSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";

/**
 * The content of the Solid panel upon login.
 */
export default function SolidContent(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const context = useContext(AppContext);
  const { block } = useAppSelector((state) => state.panel);

  const {
    activated,
    availablePods,
    selectedPod,
    webId
  } = useAppSelector(state => state.solid);

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
    dispatch(setBlock(true));
    try {
      const p = pod!;
      const s = new SolidStorage(p);

      await s.init();
      context.storage = s;
      dispatch(activateSolid());
      dispatch(resetFavorites());
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
            title={webId}
            underline={"hover"}
          >
            {webId}
          </Link>
        </Typography>
      </Stack>
      <Stack direction={"column"} gap={2}>
        <Typography>
          Select a pod that will be used to store data:
        </Typography>
        <Autocomplete
          size={"small"}
          value={pod}
          loading={!availablePods}
          options={availablePods ?? []}
          disabled={block || !!selectedPod}
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
          Download<sup> *</sup> your data from the selected pod:
        </Typography>
        <Stack direction={"row"} justifyContent={"center"}>
          <Button disabled={block || !pod || !!selectedPod || activated} onClick={activateAction}>
            Activate
          </Button>
        </Stack>
        <Typography fontSize={"small"}>
          After activation only data from your Solid Pod will appear in
          <strong>Favorites</strong>. Data from your local storage will be
          available upon logout. Local and remote storages are not synchronized.
        </Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"center"}>
        <Button
          disabled={block}
          color={"error"}
          onClick={() => { SolidProvider.logout(); }}
        >
          Log out
        </Button>
      </Stack>
    </Stack>
  );
}
