import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Close,
  Directions,
  Favorite,
  Place,
  Route
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  IconButton
} from "@mui/material";
import {
  FAVORITES_ADDR,
  SEARCH_DIRECS_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../../domain/routing";
import { hidePanel } from "../../features/panelSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";

type LogoCloseMenuProps = {

  /** Action upon clicking on a logo. */
  onLogo?: () => void;
};

/**
 * Upper menu with `logo` and `close` buttons.
 */
export function LogoCloseMenu({ onLogo: _ }: LogoCloseMenuProps): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <Box
      display={"flex"}
      justifyContent={"right"}
      sx={{ mx: 2, my: 2 }}
    >
      <IconButton
        size={"small"}
        onClick={() => { dispatch(hidePanel()); }}
      >
        <Close fontSize={"medium"} />
      </IconButton>
    </Box>
  );
}

/**
 * Upper menu with possible `back` and mandatory `close` buttons.
 */
export function BackCloseMenu(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      sx={{ mx: 2, my: 2 }}
    >
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => { navigate(-1); }}
        >
          Back
        </Button>
      </Box>
      <IconButton size={"small"} onClick={() => { dispatch(hidePanel()); }}>
        <Close fontSize={"medium"} />
      </IconButton>
    </Box>
  );
}

type MainMenuProps = {

  /** Identifier of a panel that is currently shown. */
  panel: number;
};

/**
 * Standard four-section search menu with `routes`, `places`, `directions`,
 * and `favourites`.
 */
export function MainMenu({ panel }: MainMenuProps): JSX.Element {

  const navigate = useNavigate();
  const { block } = useAppSelector(state => state.panel);

  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
      <BottomNavigation showLabels={true} value={panel}>
        <BottomNavigationAction
          label={"Routes"}
          icon={<Route />}
          disabled={block}
          onClick={() => { navigate(SEARCH_ROUTES_ADDR); }}
        />
        <BottomNavigationAction
          label={"Places"}
          icon={<Place />}
          disabled={block}
          onClick={() => { navigate(SEARCH_PLACES_ADDR); }}
        />
        <BottomNavigationAction
          label={"Directions"}
          icon={<Directions />}
          disabled={block}
          onClick={() => { navigate(SEARCH_DIRECS_ADDR); }}
        />
        <BottomNavigationAction
          label={"Favorites"}
          icon={<Favorite />}
          disabled={block}
          onClick={() => { navigate(FAVORITES_ADDR); }}
        />
      </BottomNavigation>
    </Box>
  );
}
