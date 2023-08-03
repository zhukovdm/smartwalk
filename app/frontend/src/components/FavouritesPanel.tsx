import { Box } from "@mui/material";
import { LogoCloseMenu, MainMenu } from "./shared/menus";
import StorageSection from "./favourites/StorageSection";
import MyDirecsSection from "./favourites/MyDirecsSection";
import MyPlacesSection from "./favourites/MyPlacesSection";
import MyRoutesSection from "./favourites/MyRoutesSection";

export default function FavouritesPanel(): JSX.Element {

  return (
    <Box>
      <LogoCloseMenu onLogo={() => { }} />
      <MainMenu panel={3} />
      <Box sx={{ m: 2 }}>
        <StorageSection />
        <MyPlacesSection />
        <MyRoutesSection />
        <MyDirecsSection />
      </Box>
    </Box>
  );
}
