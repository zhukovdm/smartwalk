import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { SwapVert } from "@mui/icons-material";
import { RESULT_ROUTES_ADDR } from "../domain/routing";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { setBlock } from "../features/panelSlice";
import { setResultRoutes } from "../features/resultRoutesSlice";
import {
  resetSearchRoutes,
  deleteSearchRoutesCategory,
  updateSearchRoutesCategory,
  setSearchRoutesDistance,
  setSearchRoutesSource,
  setSearchRoutesTarget,
} from "../features/searchRoutesSlice";
import { useSearchRoutesMap } from "../features/searchHooks";
import { usePlace, useStoredPlaces } from "../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../features/storeHooks";
import {
  FreePlaceListItem,
  RemovablePlaceListItem,
} from "./shared/_list-items";
import { LogoCloseMenu, MainMenu } from "./shared/_menus";
import BottomButtons from "./search/BottomButtons";
import DistanceSlider from "./search/DistanceSlider";
import CategoryBox from "./search/CategoryBox";
import SelectPlaceDialog from "./shared/SelectPlaceDialog";

export default function SearchRoutesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storedPlaces = useStoredPlaces();
  const {
    source: storedSource,
    target: storedTarget,
    distance,
    categories
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
        precedence: []
      });
      dispatch(setResultRoutes(routes));
      navigate(RESULT_ROUTES_ADDR);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Box>
      <LogoCloseMenu />
      <MainMenu panel={0} />
      <Stack direction={"column"} gap={4} sx={{ mx: 2, my: 4 }}>
        <Typography>Find routes between two points:</Typography>
        <Stack direction={"column"} gap={1}>
          <Stack direction={"column"} gap={2}>
            {(!source)
              ? <FreePlaceListItem
                  kind={"source"}
                  label={"Select starting point..."}
                  title={"Add point"}
                  onPlace={() => { setSourceSelectDialog(true); }}
                />
              : <RemovablePlaceListItem
                  kind={"source"}
                  label={source.name}
                  title={"Fly to"}
                  onPlace={() => { map?.flyTo(source); }}
                  onDelete={() => { dispatch(setSearchRoutesSource(undefined)); }}
                />
            }
            {(!target)
              ? <FreePlaceListItem
                  kind={"target"}
                  label={"Select destination..."}
                  title={"Add point"}
                  onPlace={() => { setTargetSelectDialog(true); }}
                />
              : <RemovablePlaceListItem
                  kind={"target"}
                  label={target.name}
                  title={"Fly to"}
                  onPlace={() => { map?.flyTo(target); }}
                  onDelete={() => { dispatch(setSearchRoutesTarget(undefined)); }}
                />
            }
          </Stack>
          <Box display={"flex"} justifyContent={"center"}>
            <Button
              size={"small"}
              startIcon={<SwapVert />}
              title={"Swap points"}
              onClick={() => { swapAction(); }}
              sx={{ mt: 1, textTransform: "none" }}
            >
              <span>Swap points</span>
            </Button>
          </Box>
        </Stack>
        <Typography>
          With maximum walking distance (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>):
        </Typography>
        <DistanceSlider
          max={30}
          seq={[ 5, 10, 15, 20, 25 ]}
          step={0.2}
          distance={distance}
          dispatch={(value) => { dispatch(setSearchRoutesDistance(value)); }}
        />
        <Typography>
          Visit places from the following categories:
        </Typography>
        <CategoryBox
          categories={categories}
          deleteCategory={(i) => dispatch(deleteSearchRoutesCategory(i))}
          updateCategory={(category, i) => dispatch(updateSearchRoutesCategory({ category: category, i: i }))}
        />
        <BottomButtons
          disabled={!source || !target || !(categories.length > 0)}
          what={"route"}
          onClear={() => { dispatch(resetSearchRoutes()); }}
          onSearch={() => { searchAction(); }}
        />
        <SelectPlaceDialog
          show={sourceSelectDialog}
          kind={"source"}
          onHide={() => setSourceSelectDialog(false)}
          onSelect={(place) => dispatch(setSearchRoutesSource(place))}
        />
        <SelectPlaceDialog
          show={targetSelectDialog}
          kind={"target"}
          onHide={() => setTargetSelectDialog(false)}
          onSelect={(place) => dispatch(setSearchRoutesTarget(place))}
        />
      </Stack>
    </Box>
  );
}
