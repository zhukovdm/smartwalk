import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import {
  RESULT_DIRECS_ADDR
} from "../domain/routing";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { useAppDispatch, useAppSelector } from "../features/store";
import { setBlock } from "../features/panelSlice";
import { setSearchDirecsWaypoints } from "../features/searchDirecsSlice";
import { setResultDirecs } from "../features/resultDirecsSlice";
import { LogoCloseMenu, MainMenu } from "./shared/_menus";
import BottomButtons from "./search/BottomButtons";
import SearchDirecsSequence from "./search/SearchDirecsSequence";

export default function SearchDirecsPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { waypoints } = useAppSelector((state) => state.searchDirecs);

  const searchAction = async () => {
    try {
      dispatch(setBlock(true));
      const direcs = await SmartWalkFetcher.searchDirecs(waypoints);
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
          Define sequence of points (at least two), and find the fastest routes
          visiting them in order.
        </Typography>
        <SearchDirecsSequence sequence={waypoints} />
        <BottomButtons
          disabled={waypoints.length < 2}
          onClear={() => { dispatch(setSearchDirecsWaypoints([])); }}
          onSearch={() => { searchAction(); }}
        />
      </Stack>
    </Box>
  );
}
