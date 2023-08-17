import { Box, CircularProgress, Stack } from "@mui/material";
import { LogoCloseMenu, MainMenu } from "./shared/menus";
import StorageSection from "./favorites/StorageSection";
import MyDirecsSection from "./favorites/MyDirecsSection";
import MyPlacesSection from "./favorites/MyPlacesSection";
import MyRoutesSection from "./favorites/MyRoutesSection";

type FavoritesPanelProps = {
  loaded: boolean;
  loadedRatio: number;
};

export default function FavoritesPanel({ loaded, loadedRatio }: FavoritesPanelProps): JSX.Element {

  return (
    <Box>
      <LogoCloseMenu onLogo={() => { }} />
      <MainMenu panel={3} />
      <Box sx={{ m: 2 }}>
        {loaded
          ? <Stack>
              <StorageSection />
              <MyPlacesSection />
              <MyRoutesSection />
              <MyDirecsSection />
            </Stack>
          : <Box display={"flex"} justifyContent={"center"}>
              <CircularProgress variant={"determinate"} value={Math.floor(loadedRatio * 100.0)} />
            </Box>
        }
      </Box>
    </Box>
  );
}
