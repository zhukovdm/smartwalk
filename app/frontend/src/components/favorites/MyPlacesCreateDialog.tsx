import { useContext, useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { UiPlace, WgsPoint } from "../../domain/types";
import { IdGenerator, point2place } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../features/store";
import { hidePanel, setBlock, showPanel } from "../../features/panelSlice";
import {
  createFavoritePlace,
  deleteFavoriteCustomLocation,
  resetFavoriteCustom,
  setFavoriteCustomName,
  setFavoriteCustomLocation
} from "../../features/favoritesSlice";
import {
  FreePlaceListItem,
  RemovablePlaceListItem
} from "../shared/_list-items";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

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
    map?.addCommon(pl, [], true).withDrag((point) => {
      dispatch(setFavoriteCustomLocation(point));
    });
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
                kind={"custom"}
                label={place.name}
                onPlace={() => clickPlace(place)}
                onDelete={deleteLocation}
              />
            : <FreePlaceListItem
                kind={"custom"}
                label={"Select point..."}
                onPlace={addLocation}
              />
          }
          <TextField
            required
            fullWidth
            size={"small"}
            value={name}
            placeholder={"Enter name..."}
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
              startIcon={<Save />}
              variant={"contained"}
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
