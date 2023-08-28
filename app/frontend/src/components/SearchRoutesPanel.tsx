import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SwapVert from "@mui/icons-material/SwapVert";
import { PrecedenceEdge } from "../domain/types";
import { RESULT_ROUTES_ADDR } from "../domain/routing";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { setBlock } from "../features/panelSlice";
import {
  resetResultRoutes,
  setResultRoutes
} from "../features/resultRoutesSlice";
import {
  resetSearchRoutes,
  deleteSearchRoutesCategory,
  updateSearchRoutesCategory,
  setSearchRoutesDistance,
  setSearchRoutesSource,
  setSearchRoutesTarget,
  deleteSearchRoutesPrecEdge,
  appendSearchRoutesPrecEdge,
} from "../features/searchRoutesSlice";
import { usePlace, useStoredPlaces } from "../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../features/storeHooks";
import { useSearchRoutesMap } from "../features/searchHooks";
import {
  FreePlaceListItem,
  RemovablePlaceListItem,
} from "./_shared/_list-items";
import LogoCloseBar from "./_shared/LogoCloseBar";
import PanelSelector from "./_shared/PanelSelector";
import SelectPointDialog from "./_shared/SelectPointDialog";
import BottomButtons from "./search/BottomButtons";
import CategoryBox from "./search/CategoryBox";
import DistanceSlider from "./search/DistanceSlider";
import KilometersLink from "./search/KilometersLink";
import PrecedenceBox from "./search/PrecedenceBox";

/**
 * Panel for route search configuration.
 */
export default function SearchRoutesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storedPlaces = useStoredPlaces();
  const {
    source: storedSource,
    target: storedTarget,
    distance,
    categories,
    precedence
  } = useAppSelector((state) => state.searchRoutes);

  const source = usePlace(storedSource, storedPlaces, new Map());
  const target = usePlace(storedTarget, storedPlaces, new Map());

  const map = useSearchRoutesMap(source, target);

  const [sourceSelectDialog, setSourceSelectDialog] = useState(false);
  const [targetSelectDialog, setTargetSelectDialog] = useState(false);

  const swapAction = () => {
    dispatch(setSearchRoutesSource(target));
    dispatch(setSearchRoutesTarget(source));
  };

  const searchAction = async () => {
    dispatch(setBlock(true));
    try {
      const routes = await SmartWalkFetcher.searchRoutes({
        source: source!,
        target: target!,
        distance: distance,
        categories: categories.map((cat) => ({ keyword: cat.keyword, filters: cat.filters })),
        precedence: precedence
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
    <Box role={"search"} aria-label={"Search routes"}>
      <LogoCloseBar />
      <PanelSelector panel={0} />
      <Stack direction={"column"} gap={4} sx={{ mx: 2, my: 4 }}>
        <Typography>Find routes between two points:</Typography>
        <Stack direction={"column"} gap={1}>
          <Stack direction={"column"} gap={2}>
            {(!source)
              ? <FreePlaceListItem
                  kind={"source"}
                  label={"Select starting point..."}
                  title={"Select starting point"}
                  onPlace={() => { setSourceSelectDialog(true); }}
                />
              : <RemovablePlaceListItem
                  kind={"source"}
                  label={source.name}
                  smartId={source.smartId}
                  title={"Fly to"}
                  onPlace={() => { map?.flyTo(source); }}
                  onDelete={() => { dispatch(setSearchRoutesSource(undefined)); }}
                />
            }
            {(!target)
              ? <FreePlaceListItem
                  kind={"target"}
                  label={"Select destination..."}
                  title={"Select destination"}
                  onPlace={() => { setTargetSelectDialog(true); }}
                />
              : <RemovablePlaceListItem
                  kind={"target"}
                  label={target.name}
                  smartId={target.smartId}
                  title={"Fly to"}
                  onPlace={() => { map?.flyTo(target); }}
                  onDelete={() => { dispatch(setSearchRoutesTarget(undefined)); }}
                />
            }
          </Stack>
          <Box
            display={"flex"}
            justifyContent={"center"}
          >
            <Button
              startIcon={<SwapVert />}
              onClick={() => { swapAction(); }}
              sx={{ mt: 1, textTransform: "none" }}
            >
              <span>Swap points</span>
            </Button>
          </Box>
        </Stack>
        <Typography>
          With walking distance of at most (in&nbsp;<KilometersLink />):
        </Typography>
        <DistanceSlider
          max={30}
          seq={[ 5, 10, 15, 20, 25 ]}
          step={0.2}
          distance={distance}
          dispatch={(value) => { dispatch(setSearchRoutesDistance(value)); }}
          ariaLabel={"Maximum walking distance of a route"}
        />
        <Typography>
          Visit places from the following categories:
        </Typography>
        <CategoryBox
          categories={categories}
          deleteCategory={(i) => dispatch(deleteSearchRoutesCategory(i))}
          updateCategory={(category, i) => dispatch(updateSearchRoutesCategory({ category: category, i: i }))}
        />
        <Typography>
          Categories could appear on a route in <strong>any</strong> order. Add arrows to impose a specific arrangement.
        </Typography>
        <PrecedenceBox
          categories={categories}
          precedence={precedence}
          deleteEdge={(i: number) => { dispatch(deleteSearchRoutesPrecEdge(i)); }}
          appendEdge={(e: PrecedenceEdge) => { dispatch(appendSearchRoutesPrecEdge(e)); }}
        />
        <BottomButtons
          disabled={!source || !target || !(categories.length > 0)}
          onClear={() => { dispatch(resetSearchRoutes()); }}
          onSearch={() => { searchAction(); }}
        />
        <SelectPointDialog
          show={sourceSelectDialog}
          kind={"source"}
          onHide={() => setSourceSelectDialog(false)}
          onSelect={(place) => dispatch(setSearchRoutesSource(place))}
        />
        <SelectPointDialog
          show={targetSelectDialog}
          kind={"target"}
          onHide={() => setTargetSelectDialog(false)}
          onSelect={(place) => dispatch(setSearchRoutesTarget(place))}
        />
      </Stack>
    </Box>
  );
}
