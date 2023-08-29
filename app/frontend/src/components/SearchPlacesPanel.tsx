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
import {
  usePlace,
  useStoredPlaces
} from "../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../features/storeHooks";
import { useSearchPlacesMap } from "../features/searchHooks";
import LogoCloseBar from "./_shared/LogoCloseBar";
import PanelSelector from "./_shared/PanelSelector";
import RemovablePlaceListItem from "./_shared/RemovablePlaceListItem";
import VacantPlaceListItem from "./_shared/VacantPlaceListItem";
import SelectPointDialog from "./search/SelectPointDialog";
import BottomButtons from "./search/BottomButtons";
import CategoryBox from "./search/CategoryBox";
import DistanceSlider from "./search/DistanceSlider";
import KilometersLink from "./search/KilometersLink";

/**
 * Panel for place search configuration.
 */
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

  const centerTitle = "Select center point";

  return (
    <Box
      role={"search"}
      aria-label={"Search places"}
    >
      <LogoCloseBar />
      <PanelSelector panel={1} />
      <Stack
        direction={"column"}
        gap={4}
        sx={{ mx: 2, my: 4 }}
      >
        <Box>
          <Typography>Find places around the center point:</Typography>
        </Box>
        <Box>
          {(!center)
            ? <VacantPlaceListItem
                kind={"center"}
                label={`${centerTitle}...`}
                title={centerTitle}
                onClick={() => { setSelectDialog(true); }}
              />
            : <RemovablePlaceListItem
                kind={"center"}
                place={center}
                title={"Fly to"}
                onPlace={() => { map?.flyTo(center); }}
                onRemove={() => { dispatch(setSearchPlacesCenter(undefined)); }}
              />
          }
        </Box>
        <Box>
          <Typography>
            Within a crow-fly distance of at most (in&nbsp;<KilometersLink />):
          </Typography>
        </Box>
        <Box>
          <DistanceSlider
            max={15}
            seq={[ 3, 6, 9, 12 ]}
            step={0.1}
            distance={radius}
            dispatch={(value) => { dispatch(setSearchPlacesRadius(value)); }}
            aria-label={"Maximum crow-fly distance from the center point"}
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
          onClear={() => { dispatch(resetSearchPlaces()); }}
          onSearch={() => { searchAction(); }}
        />
        <SelectPointDialog
          show={selectDialog}
          kind={"center"}
          onHide={() => { setSelectDialog(false); }}
          onSelect={(place) => { dispatch(setSearchPlacesCenter(place)) }}
        />
      </Stack>
    </Box>
  );
}
