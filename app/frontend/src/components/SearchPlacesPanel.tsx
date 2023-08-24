import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RESULT_PLACES_ADDR } from "../domain/routing";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { setBlock } from "../features/panelSlice";
import {
  resetResultPlaces,
  setResultPlaces
} from "../features/resultPlacesSlice";
import {
  deleteSearchPlacesCategory,
  resetSearchPlaces,
  setSearchPlacesCenter,
  setSearchPlacesRadius,
  updateSearchPlacesCategory
} from "../features/searchPlacesSlice";
import { usePlace, useStoredPlaces } from "../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../features/storeHooks";
import { useSearchPlacesMap } from "../features/searchHooks";
import { LogoCloseMenu, MainMenu } from "./shared/_menus";
import {
  FreePlaceListItem,
  RemovablePlaceListItem
} from "./shared/_list-items";
import SelectPlaceDialog from "./shared/SelectPlaceDialog";
import DistanceSlider from "./search/DistanceSlider";
import { KilometersLink } from "./search/KilometersLink";
import CategoryBox from "./search/CategoryBox";
import BottomButtons from "./search/BottomButtons";

export default function SearchPlacesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storedPlaces = useStoredPlaces();
  const {
    center: storedCenter,
    radius,
    categories
  } = useAppSelector((state) => state.searchPlaces);

  const center = usePlace(storedCenter, storedPlaces, new Map());

  const map = useSearchPlacesMap(center, radius);

  const [selectDialog, setSelectDialog] = useState(false);

  const searchAction = async () => {
    dispatch(setBlock(true));
    try {
      const places = await SmartWalkFetcher.searchPlaces({
        center: center!,
        radius: radius,
        categories: categories.map((cat) => ({ keyword: cat.keyword, filters: cat.filters }))
      });
      dispatch(resetResultPlaces());
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
          <Typography>Find places around a center point:</Typography>
        </Box>
        <Box>
          {(!center)
            ? <FreePlaceListItem
                kind={"center"}
                label={"Select point..."}
                title={"Select point"}
                onPlace={() => { setSelectDialog(true); }}
              />
            : <RemovablePlaceListItem
                kind={"center"}
                label={center.name}
                smartId={center.smartId}
                title={"Fly to"}
                onPlace={() => { map?.flyTo(center); }}
                onDelete={() => { dispatch(setSearchPlacesCenter(undefined)); }}
              />
          }
        </Box>
        <Box>
          <Typography>
            At a distance at most (in <KilometersLink />):
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
          Belonging to the following categories:
        </Typography>
        <CategoryBox
          categories={categories}
          deleteCategory={(i) => dispatch(deleteSearchPlacesCategory(i))}
          updateCategory={(category, i) => dispatch(updateSearchPlacesCategory({ category: category, i: i }))}
        />
        <BottomButtons
          disabled={!center}
          what={"place"}
          onClear={() => { dispatch(resetSearchPlaces()); }}
          onSearch={() => { searchAction(); }}
        />
        <SelectPlaceDialog
          show={selectDialog}
          kind={"center"}
          onHide={() => { setSelectDialog(false); }}
          onSelect={(place) => { dispatch(setSearchPlacesCenter(place)) }}
        />
      </Stack>
    </Box>
  );
}
