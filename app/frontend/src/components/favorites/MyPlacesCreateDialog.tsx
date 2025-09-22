import {
  MouseEventHandler,
  useContext,
  useMemo,
  useState
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import { AppContext } from "../../App";
import { UiPlace, WgsPoint } from "../../domain/types";
import { point2place } from "../../utils/functions";
import IdGenerator from "../../utils/idGenerator";
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
  setFavoriteCustomLocation,
  toggleFavoriteCreateExpanded
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

  const { block } = useAppSelector((state) => state.panel);
  const {
    name,
    location,
    createExpanded
  } = useAppSelector((state) => state.favorites);

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

  const onToggle: MouseEventHandler<HTMLDetailsElement> = (e) => {

    /* Without preventing default behavior, expansion happens only upon
     * the second click.
     *  - https://github.com/facebook/react/issues/15486#issuecomment-488028431
     */

    e.preventDefault();
    dispatch(toggleFavoriteCreateExpanded());
  }

  return (
    <Box sx={{ mt: 3, mb: 1 }}>
      <details open={createExpanded}>
        <summary
          onClick={onToggle}
          style={{ cursor: "pointer" }}
        >
          <Typography sx={{ display: "inline-block", fontWeight: "medium" }}>
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
                title={"Select location"}
                label={"Select location..."}
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
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
          >
            <Button
              color={"error"}
              disabled={block}
              onClick={clearCustom}
            >
              <span>Clear</span>
            </Button>
            <Button
              disabled={block || !place || !(name.trim().length > 0)}
              loading={loading}
              loadingPosition={"start"}
              startIcon={<SaveIcon />}
              onClick={createPlace}
            >
              <span>Create</span>
            </Button>
          </Box>
        </Stack>
      </details>
    </Box>
  );
}
