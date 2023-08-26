import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  RESULT_DIRECS_ADDR
} from "../domain/routing";
// import { SmartWalkFetcher } from "../utils/smartwalk";
import { OsrmProjectFetcher } from "../utils/osrmProject";
import { setBlock } from "../features/panelSlice";
import {
  resetResultDirecs,
  setResultDirecs
} from "../features/resultDirecsSlice";
import { resetSearchDirecs } from "../features/searchDirecsSlice";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../features/storeHooks";
import { LogoCloseMenu, MainMenu } from "./shared/_menus";
import BottomButtons from "./search/BottomButtons";
import SearchDirecsSequence from "./search/SearchDirecsSequence";

/**
 * Panel for direction search configuration.
 */
export default function SearchDirecsPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();
  const {
    waypoints: storedWaypoints
  } = useAppSelector((state) => state.searchDirecs);

  const waypoints = usePlaces(storedWaypoints, storedPlaces, storedSmarts);

  const searchAction = async () => {
    dispatch(setBlock(true));
    try {
      // const direcs = await SmartWalkFetcher.searchDirecs(waypoints);
      const direcs = await OsrmProjectFetcher.searchDirecs(waypoints);

      dispatch(resetResultDirecs());
      dispatch(setResultDirecs(direcs));
      navigate(RESULT_DIRECS_ADDR);
    }
    catch (ex) { alert(ex); }
    finally {
      dispatch(setBlock(false));
    }
  };

  return (
    <Box>
      <LogoCloseMenu onLogo={() => {}} />
      <MainMenu panel={2} />
      <Stack direction="column" gap={4} sx={{ mx: 2, my: 4 }}>
        <Typography>
          Define a sequence of points (at least two), and find the fastest routes visiting them in order.
        </Typography>
        <SearchDirecsSequence waypoints={waypoints} />
        <BottomButtons
          disabled={waypoints.length < 2}
          onClear={() => { dispatch(resetSearchDirecs()); }}
          onSearch={() => { searchAction(); }}
        />
      </Stack>
    </Box>
  );
}
