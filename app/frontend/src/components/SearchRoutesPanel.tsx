import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Arrow } from "../domain/types";
import { RESULT_ROUTES_ADDR } from "../utils/routing";
import { fetchSearchRoutes } from "../utils/smartwalk";
import { setBlock } from "../features/panelSlice";
import {
  resetResultRoutes,
  setResultRoutes
} from "../features/resultRoutesSlice";
import {
  appendSearchRoutesCategory,
  appendSearchRoutesArrow,
  deleteSearchRoutesCategory,
  deleteSearchRoutesArrow,
  resetSearchRoutes,
  setSearchRoutesMaxDistance,
  updateSearchRoutesCategory,
} from "../features/searchRoutesSlice";
import {
  usePlace,
  useStoredPlaces,
  useStoredSmarts
} from "../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../features/storeHooks";
import { useSearchRoutesMap } from "../features/searchHooks";
import LogoCloseBar from "./_shared/LogoCloseBar";
import PanelSelector from "./_shared/PanelSelector";
import ArrowBox from "./search/ArrowBox";
import BottomButtons from "./search/BottomButtons";
import CategoryBox from "./search/CategoryBox";
import DistanceSlider from "./search/DistanceSlider";
import KilometersLink from "./search/KilometersLink";
import SourceTargetBox from "./search/SourceTargetBox";

/**
 * Panel for route search configuration.
 */
export default function SearchRoutesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    source: storedSource,
    target: storedTarget,
    maxDistance,
    categories,
    arrows
  } = useAppSelector((state) => state.searchRoutes);

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();

  const source = usePlace(storedSource, storedPlaces, storedSmarts);
  const target = usePlace(storedTarget, storedPlaces, storedSmarts);

  const map = useSearchRoutesMap(source, target);

  const searchAction = async () => {
    dispatch(setBlock(true));
    try {
      const routes = await fetchSearchRoutes({
        source: source!,
        target: target!,
        maxDistance: maxDistance,
        categories: categories.map((cat) => ({ keyword: cat.keyword, filters: cat.filters })),
        arrows
      });
      dispatch(resetResultRoutes());
      dispatch(setResultRoutes(routes));
      navigate(RESULT_ROUTES_ADDR);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Box
      role={"search"}
      aria-label={"Routes"}
    >
      <LogoCloseBar />
      <PanelSelector panel={0} />
      <Stack
        direction={"column"}
        gap={3}
        sx={{ mx: 2, my: 4 }}
      >
        <Typography>Find routes between two points:</Typography>
        <SourceTargetBox
          map={map}
          source={source}
          target={target}
        />
        <Typography>
          With walking distance of at most (in&nbsp;<KilometersLink />):
        </Typography>
        <DistanceSlider
          max={15.0}
          seq={[ 3.0, 6.0, 9.0, 12.0 ]}
          step={0.2}
          distance={maxDistance}
          dispatch={(value) => { dispatch(setSearchRoutesMaxDistance(value)); }}
          aria-label={"Maximum walking distance of a route"}
        />
        <Typography>
          Visit places from the following categories:
        </Typography>
        <CategoryBox
          categories={categories}
          onAppend={(category) => { dispatch(appendSearchRoutesCategory(category)); }}
          onDelete={(i) => dispatch(deleteSearchRoutesCategory(i))}
          onUpdate={(category, i) => dispatch(updateSearchRoutesCategory({ category, i }))}
        />
        <Typography>
          Categories could appear on a route in <em>any</em> order. Add arrows to impose a specific arrangement.
        </Typography>
        <ArrowBox
          categories={categories}
          arrows={arrows}
          deleteArrow={(i: number) => { dispatch(deleteSearchRoutesArrow(i)); }}
          appendArrow={(e: Arrow) => { dispatch(appendSearchRoutesArrow(e)); }}
        />
        <BottomButtons
          disabled={!source || !target || !(categories.length > 0)}
          onClear={() => { dispatch(resetSearchRoutes()); }}
          onSearch={() => { searchAction(); }}
        />
      </Stack>
    </Box>
  );
}
