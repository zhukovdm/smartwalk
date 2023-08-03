import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import { RESULT_DIRECS_ADDR, SEARCH_DIRECS_ADDR } from "../domain/routing";
import { GrainPathFetcher } from "../utils/grainpath";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setBlock } from "../features/panelSlice";
import { setSearchDirecsSequence } from "../features/searchDirecsSlice";
import {
  setResultDirecs,
  setResultDirecsBack
} from "../features/resultDirecsSlice";
import { LogoCloseMenu, MainMenu } from "./shared/menus";
import BottomButtons from "./search/BottomButtons";
import SearchDirecsSequence from "./search/SearchDirecsSequence";

export default function SearchDirecsPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { sequence } = useAppSelector(state => state.searchDirecs);

  const searchAction = () => {
    new Promise<void>((res, _) => { dispatch(setBlock(true)); res(); })
      .then(() => GrainPathFetcher.fetchDirecs(sequence))
      .then((res) => {
        dispatch(setResultDirecs(res));
        dispatch(setResultDirecsBack(SEARCH_DIRECS_ADDR));
        navigate(RESULT_DIRECS_ADDR);
      })
      .catch((ex) => { alert(ex); })
      .finally(() => { dispatch(setBlock(false)); })
  };

  return (
    <Box>
      <LogoCloseMenu onLogo={() => {}} />
      <MainMenu panel={2} />
      <Stack direction="column" gap={4} sx={{ mx: 2, my: 4 }}>
        <Typography>
          Define sequence of points (at least two), and find the fastest route
          visiting them in order.
        </Typography>
        <SearchDirecsSequence sequence={sequence} />
        <BottomButtons
          disabled={sequence.length < 2}
          onClear={() => { dispatch(setSearchDirecsSequence([])); }}
          onSearch={() => { searchAction(); }}
        />
      </Stack>
    </Box>
  );
}
