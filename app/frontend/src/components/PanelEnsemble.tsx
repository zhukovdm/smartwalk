import { useEffect } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";
import { showPanel } from "../features/panelSlice";
import { useAppDispatch } from "../features/storeHooks";
import { useFavorites } from "../features/panelHooks";
import PanelDrawer from "./PanelDrawer";
import SessionProvider from "./SessionProvider";

/**
 * Main panel drawer with routing capabilities.
 */
export default function PanelEnsemble(): JSX.Element {

  useFavorites();
  const dispatch = useAppDispatch();

  useEffect(() => { dispatch(showPanel()); }, [dispatch]);

  return (
    <>
      <Box
        sx={{ position: "absolute", top: "10px", left: "10px" }}
      >
        <Fab
          color={"primary"}
          size={"small"}
          title={"Show panel"}
          onClick={() => { dispatch(showPanel()); }}
        >
          <MenuIcon />
        </Fab>
      </Box>
      {
        /*
         *                     Order matters!
         * Session provider shall be rendered BEFORE panel drawer.
         */
      }
      <SessionProvider />
      <PanelDrawer />
    </>
  );
}
