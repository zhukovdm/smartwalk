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
import { Favorite } from "@mui/icons-material";
import { AppContext } from "../../App";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../../domain/types";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  setSolidAvailablePods,
  setSolidSelectedPod,
  setSolidDirecsCurCount,
  setSolidDirecsTotCount,
  setSolidPlacesCurCount,
  setSolidPlacesTotCount,
  setSolidRoutesCurCount,
  setSolidRoutesTotCount
} from "../../features/solidSlice";
import {
  resetFavourites,
  setFavouriteDirecs,
  setFavouriteDirecsLoaded,
  setFavouritePlaces,
  setFavouritePlacesLoaded,
  setFavouriteRoutes,
  setFavouriteRoutesLoaded
} from "../../features/favouritesSlice";
import { setBlock } from "../../features/panelSlice";
import SolidStorage from "../../utils/solidStorage";
import SolidProvider from "../../utils/solidProvider";
import { FAVOURITES_ADDR } from "../../domain/routing";
import SolidLoading from "./SolidLoading";

/**
 * The content of the Solid panel upon login.
 */
export default function SolidContent(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const context = useContext(AppContext);
  const { block } = useAppSelector(state => state.panel);

  const {
    webId,
    selectedPod,
    availablePods,
    placesCurCount: curPlaces,
    placesTotCount: totPlaces,
    routesCurCount: curRoutes,
    routesTotCount: totRoutes,
    direcsCurCount: curDirecs,
    direcsTotCount: totDirecs
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

  const downloadAction = async (): Promise<void> => {
    dispatch(setBlock(true));
    try {
      const p = pod!;
      const s = await new SolidStorage(p).init();

      const places = await s.getPlacesList();
      const routes = await s.getRoutesList();
      const direcs = await s.getDirecsList();

      dispatch(setSolidPlacesCurCount(0));
      dispatch(setSolidRoutesCurCount(0));
      dispatch(setSolidDirecsCurCount(0));

      dispatch(setSolidPlacesTotCount(places.length));
      dispatch(setSolidRoutesTotCount(routes.length));
      dispatch(setSolidDirecsTotCount(direcs.length));

      let pcnt = 0; let parr: StoredPlace[] = [];
      let rcnt = 0; let rarr: StoredRoute[] = [];
      let dcnt = 0; let darr: StoredDirec[] = [];

      for (const url of places) {
        parr.push(await s.getPlace(url));
        dispatch(setSolidPlacesCurCount(++pcnt));
      }

      for (const url of routes) {
        rarr.push(await s.getRoute(url));
        dispatch(setSolidRoutesCurCount(++rcnt));
      }

      for (const url of direcs) {
        darr.push(await s.getDirec(url));
        dispatch(setSolidDirecsCurCount(++dcnt));
      }

      context.storage = s;
      dispatch(setSolidSelectedPod(p));

      dispatch(resetFavourites());

      dispatch(setFavouritePlaces(parr));
      dispatch(setFavouritePlacesLoaded());

      dispatch(setFavouriteRoutes(rarr));
      dispatch(setFavouriteRoutesLoaded());

      dispatch(setFavouriteDirecs(darr));
      dispatch(setFavouriteDirecsLoaded());
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="column" gap={1}>
        <Typography>You are logged in with WebId:</Typography>
        <Typography align="center">
          <Link href={webId} rel="noopener noreferrer" target="_blank" title={webId} underline="hover">{webId}</Link>
        </Typography>
      </Stack>
      <Stack direction="column" gap={2}>
        <Typography>
          Select a pod that will be used to store data:
        </Typography>
        <Autocomplete
          size="small"
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
                    {!availablePods ? <CircularProgress color="inherit" size={20} /> : null}
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
        <Stack direction="row" justifyContent="center">
          <Button disabled={block || !pod || !!selectedPod} onClick={downloadAction}>
            Download
          </Button>
        </Stack>
        <Typography fontSize="small">
          <sup>*</sup> After download only data from your Solid Pod will appear
          in <strong>Favourites</strong>. Data from your local storage will be
          available upon logout. Local and remote storages are not synchronized.
        </Typography>
      </Stack>
      <Stack gap={2}>
        <SolidLoading cur={curPlaces} tot={totPlaces} what="place" />
        <SolidLoading cur={curRoutes} tot={totRoutes} what="route" />
        <SolidLoading cur={curDirecs} tot={totDirecs} what="direction" />
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button disabled={block} color="error" onClick={() => { SolidProvider.logout(); }}>Log out</Button>
        <Button startIcon={<Favorite />} disabled={block || !selectedPod} onClick={() => { navigate(FAVOURITES_ADDR); }}>Go to Favourites</Button>
      </Stack>
    </Stack>
  );
}
