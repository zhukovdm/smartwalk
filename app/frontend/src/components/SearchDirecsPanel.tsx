import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import {
  RESULT_DIRECS_ADDR
} from "../domain/routing";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { useAppDispatch, useAppSelector } from "../features/store";
import { setBlock } from "../features/panelSlice";
import { resetSearchDirecs } from "../features/searchDirecsSlice";
import { setResultDirecs } from "../features/resultDirecsSlice";
import { LogoCloseMenu, MainMenu } from "./shared/_menus";
import BottomButtons from "./search/BottomButtons";
import SearchDirecsSequence from "./search/SearchDirecsSequence";
import { usePlaces, useStoredPlaces, useStoredSmarts } from "../features/hooks";

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
      dispatch(setResultDirecs(await SmartWalkFetcher.searchDirecs(waypoints)));
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
          Define sequence of points (at least two), and find the fastest routes
          visiting them in order.
        </Typography>
        <SearchDirecsSequence
          waypoints={waypoints}
          storedPlaces={storedPlaces}
          storedSmarts={storedSmarts}
        />
        <BottomButtons
          disabled={waypoints.length < 2}
          onClear={() => { dispatch(resetSearchDirecs()); }}
          onSearch={() => { searchAction(); }}
        />
      </Stack>
    </Box>
  );
}
