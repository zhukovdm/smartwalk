import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LoadingStubWithLabel from "./_shared/LoadingStubWithLabel";
import LogoCloseBar from "./_shared/LogoCloseBar";
import PanelSelector from "./_shared/PanelSelector";
import StorageSection from "./favorites/StorageSection";
import MyDirecsSection from "./favorites/MyDirecsSection";
import MyPlacesSection from "./favorites/MyPlacesSection";
import MyRoutesSection from "./favorites/MyRoutesSection";

export type FavoritesPanelProps = {

  /** Loaded from the storage */
  loaded: boolean;

  /** Ratio of loaded entities / all stored entities. */
  loadedRatio: number;
};

/**
 * Panel with favorite entities.
 */
export default function FavoritesPanel(
  { loaded, loadedRatio }: FavoritesPanelProps): JSX.Element {

  return (
    <Box>
      <LogoCloseBar />
      <PanelSelector panel={3} />
      <Box sx={{ m: 2 }}>
        {(loaded)
          ? <Stack>
              <StorageSection />
              <MyPlacesSection />
              <MyRoutesSection />
              <MyDirecsSection />
            </Stack>
          : <LoadingStubWithLabel
              progress={loadedRatio < 1.0 ? Math.floor(loadedRatio * 100.0) : 0.0}
            />
        }
      </Box>
    </Box>
  );
}
