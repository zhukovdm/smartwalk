import { useContext, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import { AppContext } from "../../App";
import { UiPlace, WgsPoint } from "../../domain/types";
import { IdGenerator, point2place } from "../../utils/helpers";
import {
  hidePanel,
  setBlock,
  showPanel
} from "../../features/panelSlice";
import {
  createFavoritePlace,
  deleteFavoriteCustomLocation,
  resetFavoriteCustom,
  setFavoriteCustomName,
  setFavoriteCustomLocation
} from "../../features/favoritesSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import RemovablePlaceListItem from "../_shared/RemovablePlaceListItem";
import VacantPlaceListItem from "../_shared/VacantPlaceListItem";

/**
 * Dialog with the user enabling to create custom place (named location).
 */
export default function MyPlacesCreateDialog(): JSX.Element {

  const { map, storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { block } = useAppSelector(state => state.panel);
  const { name, location } = useAppSelector(state => state.favorites);

  const [loading, setLoading] = useState(false);

  const place = useMemo(() => (
    location ? point2place(location) : undefined
  ), [location]);

  const clickPlace = (pl: UiPlace) => {
    map?.clear();
    map?.addCommon(pl, [], true)
      .withDrag((point) => { dispatch(setFavoriteCustomLocation(point)); });
    map?.flyTo(pl);
  };

  const callback = (pt: WgsPoint) => {
    const pl = point2place(pt);
    map?.addCommon(pl, [], true).withDrag((point) => {
      dispatch(setFavoriteCustomLocation(point));
    });
    dispatch(setFavoriteCustomLocation(pt));
    dispatch(showPanel());
  };

  const addLocation = () => {
    dispatch(hidePanel());
    map?.clear();
    map?.captureLocation(callback);
  };

  const deleteLocation = () => {
    map?.clear();
    dispatch(deleteFavoriteCustomLocation());
  };

  const clearCustom = () => {
    map?.clear();
    dispatch(resetFavoriteCustom());
  };

  const createPlace = async () => {
    setLoading(true);
    dispatch(setBlock(true));
    try {
      const pl = {
        name: name.trim(),
        location: place!.location,
        keywords: [],
        categories: []
      };
      const st = {
        ...pl,
        placeId: IdGenerator.generateId(pl)
      };
      await storage.createPlace(st);
      dispatch(createFavoritePlace(st));
      clearCustom();
    }
    catch (ex) { alert(ex); }
    finally {
      setLoading(false);
      dispatch(setBlock(false));
    }
  };

  const title = "Select location";

  return (
    <Box sx={{ mt: 4, mb: 1 }}>
      <details>
        <summary style={{ cursor: "pointer" }}>
          <Typography sx={{ display: "inline-block" }}>
            Create custom place
          </Typography>
        </summary>
        <Stack direction={"column"} gap={2} sx={{ mt: 2 }}>
          {place
            ? <RemovablePlaceListItem
                kind={"common"}
                place={place}
                title={"Draw point"}
                onPlace={() => clickPlace(place)}
                onRemove={deleteLocation}
              />
            : <VacantPlaceListItem
                kind={"common"}
                title={title}
                label={`${title}...`}
                onClick={addLocation}
              />
          }
          <TextField
            label={"Name"}
            required
            fullWidth
            size={"small"}
            value={name}
            onChange={(e) => dispatch(setFavoriteCustomName(e.target.value))}
          />
          <Box display={"flex"} justifyContent={"space-evenly"}>
            <Button
              color={"error"}
              disabled={block}
              onClick={clearCustom}
            >
              <span>Clear</span>
            </Button>
            <LoadingButton
              disabled={block || !place || !(name.trim().length > 0)}
              loading={loading}
              loadingPosition={"start"}
              startIcon={<SaveIcon />}
              onClick={createPlace}
            >
              <span>Create</span>
            </LoadingButton>
          </Box>
        </Stack>
      </details>
    </Box>
  );
}
