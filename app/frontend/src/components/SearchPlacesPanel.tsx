import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { AppContext } from "../App";
import { RESULT_PLACES_ADDR } from "../domain/routing";
import { point2place } from "../utils/helpers";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { setBlock } from "../features/panelSlice";
import { setResultPlaces } from "../features/resultPlacesSlice";
import {
  deleteSearchPlacesCategory,
  resetSearchPlaces,
  setSearchPlacesCenter,
  setSearchPlacesRadius,
  updateSearchPlacesCategory
} from "../features/searchPlacesSlice";
import { usePlace, useStoredPlaces } from "../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../features/storeHooks";
import { LogoCloseMenu, MainMenu } from "./shared/_menus";
import {
  FreePlaceListItem,
  RemovablePlaceListItem
} from "./shared/_list-items";
import SelectPlaceDialog from "./shared/SelectPlaceDialog";
import DistanceSlider from "./search/DistanceSlider";
import KeywordsBox from "./search/KeywordsBox";
import BottomButtons from "./search/BottomButtons";

export default function SearchPlacesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  const storedPlaces = useStoredPlaces();
  const {
    center: storedCenter,
    radius,
    categories
  } = useAppSelector((state) => state.searchPlaces);

  const center = usePlace(storedCenter, storedPlaces, new Map());

  const [selectDialog, setSelectDialog] = useState(false);

  useEffect(() => {
    map?.clear();
    const meters = radius * 1000.0;

    if (center) {
      (center.placeId)
        ? map?.addStored(center, [])
        : map?.addCommon(center, [], true).withDrag(pt => dispatch(setSearchPlacesCenter(point2place(pt)))).withCirc(map, meters);

      map?.drawCircle(center.location, meters);
    }
  }, [map, navigate, dispatch, center, radius]);

  const searchAction = async () => {
    dispatch(setBlock(true));
    try {
      const places = await SmartWalkFetcher.searchPlaces({
        center: center!,
        radius: radius,
        categories: categories.map((cat) => ({ keyword: cat.keyword, filters: cat.filters }))
      });
      dispatch(setResultPlaces(places));
      navigate(RESULT_PLACES_ADDR);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Box>
      <LogoCloseMenu />
      <MainMenu panel={1} />
      <Stack
        direction={"column"}
        gap={4}
        sx={{ mx: 2, my: 4 }}
      >
        <Box>
          <Typography>Find places around the center point:</Typography>
        </Box>
        <Box>
          {(center)
            ? <RemovablePlaceListItem
                kind={center.placeId ? "stored" : "custom"}
                label={center.name}
                onPlace={() => { map?.flyTo(center); }}
                onDelete={() => { dispatch(setSearchPlacesCenter(undefined)); }}
              />
            : <FreePlaceListItem
                kind={"center"}
                label={"Select point..."}
                onPlace={() => { setSelectDialog(true); }}
              />
          }
        </Box>
        <Box>
          <Typography>
            At a distance at most (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>):
          </Typography>
        </Box>
        <Box>
          <DistanceSlider
            max={15}
            seq={[ 3, 6, 9, 12 ]}
            step={0.1}
            distance={radius}
            dispatch={(value) => { dispatch(setSearchPlacesRadius(value)); }}
          />
        </Box>
        <Typography>
          Satisfying the following conditions:
        </Typography>
        <KeywordsBox
          categories={categories}
          deleteCategory={(i) => dispatch(deleteSearchPlacesCategory(i))}
          updateCategory={(category, i) => dispatch(updateSearchPlacesCategory({ category: category, i: i }))}
        />
        <BottomButtons
          disabled={!center}
          onClear={() => { dispatch(resetSearchPlaces()); }}
          onSearch={() => { searchAction(); }}
        />
        {selectDialog &&
          <SelectPlaceDialog
            show={selectDialog}
            kind={"center"}
            onHide={() => { setSelectDialog(false); }}
            onSelect={(place) => { dispatch(setSearchPlacesCenter(place)) }}
          />
        }
      </Stack>
    </Box>
  );
}
