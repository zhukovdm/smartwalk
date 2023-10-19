import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import DirectionsIcon from "@mui/icons-material/Directions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceIcon from "@mui/icons-material/Place";
import RouteIcon from "@mui/icons-material/Route";
import {
  FAVORITES_ADDR,
  SEARCH_DIRECS_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../../utils/routing";
import { useAppSelector } from "../../features/storeHooks";

type PanelSelectorProps = {

  /** Identifier of a panel that is currently shown. */
  panel: number;
};

/**
 * Standard four-section search menu with `routes`, `places`, `directions`,
 * and `favorites`.
 */
export default function PanelSelector({ panel }: PanelSelectorProps): JSX.Element {

  const navigate = useNavigate();
  const { block } = useAppSelector((state) => state.panel);

  return (
    <Box
      aria-label={"Panels"}
      role={"navigation"}
      sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}
    >
      <BottomNavigation showLabels={true} value={panel}>
        <BottomNavigationAction
          aria-label={"Search routes"}
          label={"Routes"}
          data-testid={"smartwalk-search-routes-button"}
          icon={<RouteIcon />}
          disabled={block}
          onClick={() => { navigate(SEARCH_ROUTES_ADDR); }}
        />
        <BottomNavigationAction
          aria-label={"Search places"}
          label={"Places"}
          data-testid={"smartwalk-search-places-button"}
          icon={<PlaceIcon />}
          disabled={block}
          onClick={() => { navigate(SEARCH_PLACES_ADDR); }}
        />
        <BottomNavigationAction
          aria-label={"Search directions"}
          label={"Directions"}
          data-testid={"smartwalk-search-direcs-button"}
          icon={<DirectionsIcon />}
          disabled={block}
          onClick={() => { navigate(SEARCH_DIRECS_ADDR); }}
        />
        <BottomNavigationAction
          label={"Favorites"}
          data-testid={"smartwalk-search-favors-button"}
          icon={<FavoriteIcon />}
          disabled={block}
          onClick={() => { navigate(FAVORITES_ADDR); }}
        />
      </BottomNavigation>
    </Box>
  );
}
