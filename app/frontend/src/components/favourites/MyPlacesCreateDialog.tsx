import { useContext, useMemo } from "react";
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
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { hidePanel, setBlock, showPanel } from "../../features/panelSlice";
import {
  createFavouritePlace,
  setFavouriteCustomName,
  setFavouriteCustomLocation,
  deleteFavouriteCustomLocation,
  clearFavouriteCustom
} from "../../features/favouritesSlice";
import {
  FreePlaceListItem,
  RemovablePlaceListItem
} from "../shared/list-items";

/**
 * Dialog with the user enabling to create custom place (named location).
 */
export default function MyPlacesCreateDialog(): JSX.Element {

  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);
  const { block } = useAppSelector(state => state.panel);
  const { name, location } = useAppSelector(state => state.favourites);

  const place = useMemo(() => location ? point2place(location) : undefined, [location]);

  const clickPlace = (pl: UiPlace) => {
    map?.clear();
    map?.addCustom(pl, true).withDrag((point) => {
      dispatch(setFavouriteCustomLocation(point));
    });
    map?.flyTo(pl);
  };

  const callback = (pt: WgsPoint) => {
    const pl = point2place(pt);
    map?.addCustom(pl, true).withDrag((point) => {
      dispatch(setFavouriteCustomLocation(point));
    });
    dispatch(setFavouriteCustomLocation(pt));
    dispatch(showPanel());
  };

  const addLocation = () => {
    dispatch(hidePanel());
    map?.clear();
    map?.captureLocation(callback);
  };

  const deleteLocation = () => {
    map?.clear();
    dispatch(deleteFavouriteCustomLocation());
  };

  const clearCustom = () => {
    map?.clear();
    dispatch(clearFavouriteCustom());
  };

  const createPlace = async () => {
    dispatch(setBlock(true));
    try {
      const pl = {
        name: name.trim(),
        location: place!.location,
        keywords: [],
        selected: []
      };
      const st = {
        ...pl,
        placeId: IdGenerator.generateId(pl)
      };
      await storage.createPlace(st);
      dispatch(createFavouritePlace(st));
      clearCustom();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Box sx={{ mt: 4, mb: 1 }}>
      <details>
        <summary style={{ cursor: "pointer" }}>
          <Typography sx={{ display: "inline-block" }}>
            Create custom place
          </Typography>
        </summary>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          {place
            ? <RemovablePlaceListItem
                kind="custom"
                label={place.name}
                onPlace={() => clickPlace(place)}
                onDelete={deleteLocation}
              />
            : <FreePlaceListItem
                kind="custom"
                label="Select point..."
                onPlace={addLocation}
              />
          }
          <TextField
            required
            fullWidth
            size="small"
            value={name}
            placeholder="Enter name..."
            onChange={(e) => dispatch(setFavouriteCustomName(e.target.value))}
          />
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button color="error" disabled={block} onClick={clearCustom}>
              Clear
            </Button>
            <Button
              variant="contained"
              disabled={block || !place || !(name.trim().length > 0)}
              onClick={createPlace}
            >
              Create
            </Button>
          </Box>
        </Stack>
      </details>
    </Box>
  );
}
