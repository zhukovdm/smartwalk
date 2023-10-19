import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RESULT_PLACES_ADDR } from "../utils/routing";
import { fetchSearchPlaces } from "../utils/smartwalk";
import { setBlock } from "../features/panelSlice";
import {
  resetResultPlaces,
  setResultPlaces
} from "../features/resultPlacesSlice";
import {
  appendSearchPlacesCategory,
  deleteSearchPlacesCategory,
  resetSearchPlaces,
  setSearchPlacesRadius,
  updateSearchPlacesCategory
} from "../features/searchPlacesSlice";
import {
  usePlace,
  useStoredPlaces,
  useStoredSmarts
} from "../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../features/storeHooks";
import { useSearchPlacesMap } from "../features/searchHooks";
import LogoCloseBar from "./_shared/LogoCloseBar";
import PanelSelector from "./_shared/PanelSelector";
import BottomButtons from "./search/BottomButtons";
import CategoryBox from "./search/CategoryBox";
import DistanceSlider from "./search/DistanceSlider";
import KilometersLink from "./search/KilometersLink";
import CenterPointBox from "./search/CenterPointBox";

/**
 * Panel for place search configuration.
 */
export default function SearchPlacesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    center: centerFromStore,
    radius,
    categories
  } = useAppSelector((state) => state.searchPlaces);

  const center = usePlace(centerFromStore, useStoredPlaces(), useStoredSmarts());

  const map = useSearchPlacesMap(center, radius);

  const searchAction = async () => {
    dispatch(setBlock(true));
    try {
      const places = await fetchSearchPlaces({
        center: center!,
        radius: radius,
        categories: categories.map(({ keyword, filters }) => ({ keyword, filters }))
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
    <Box
      role={"search"}
      aria-label={"Places"}
    >
      <LogoCloseBar />
      <PanelSelector panel={1} />
      <Stack
        direction={"column"}
        gap={3}
        sx={{ mx: 2, my: 4 }}
      >
        <Box>
          <Typography>Find places around the center point:</Typography>
        </Box>
        <CenterPointBox
          map={map}
          center={center}
        />
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
          onAppend={(category) => { dispatch(appendSearchPlacesCategory(category)); }}
          onDelete={(i) => { dispatch(deleteSearchPlacesCategory(i)); }}
          onUpdate={(category, i) => dispatch(updateSearchPlacesCategory({ category, i }))}
        />
        <BottomButtons
          disabled={!center}
          onClear={() => { dispatch(resetSearchPlaces()); }}
          onSearch={() => { searchAction(); }}
        />
      </Stack>
    </Box>
  );
}
