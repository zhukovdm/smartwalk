import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonProps,
  Icon,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  styled
} from "@mui/material";
import { AppContext } from "../App";
import { SESSION_SOLID_ADDR } from "../domain/routing";
import LocalStorage from "../utils/localStorage";
import SolidProvider from "../utils/solidProvider";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { showPanel } from "../features/panelSlice";
import { resetFavourites } from "../features/favouritesSlice";
import {
  resetSession,
  setSessionLogin,
  setSessionSolid
} from "../features/sessionSlice";
import {
  resetSolid,
  setSolidRedirect,
  setSolidWebId
} from "../features/solidSlice";
import { SESSION_SOLID_ICON } from "./session/icons";
import SolidLoginDialog from "./session/SolidLoginDialog";

const SessionButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  }
}));

/**
 * Menu and dialogs for supported remote storage providers.
 */
export default function SessionProvider():JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const context = useContext(AppContext);

  // state

  const {
    login,
    solid
  } = useAppSelector(state => state.session);

  // menu

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const clickMenuAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => { setAnchorEl(null); };

  // solid

  const {
    redirect: solidRedirect
  } = useAppSelector(state => state.solid);

  const [solidLoginDialog, setSolidLoginDialog] = useState(false);

  useEffect(() => {
    if (!solidRedirect) {
      SolidProvider.redirect(
        (webId: string) => {
          dispatch(setSessionLogin());
          dispatch(setSessionSolid());
          dispatch(setSolidWebId(webId));
          navigate(SESSION_SOLID_ADDR);
        },
        (error: string | null) => { alert(`[Solid error] ${error}`); },
        () => {
          dispatch(resetSolid());
          dispatch(resetSession());
          dispatch(resetFavourites());
          context.storage = new LocalStorage();
        }
      );
      dispatch(setSolidRedirect());
    }
  }, [navigate, dispatch, context, solidRedirect]);

  // session

  const sessionLabel = () => {
    if (solid) { return "Solid"; }
  }

  const sessionAction = () => {
    dispatch(showPanel());
    if (solid) { navigate(SESSION_SOLID_ADDR); }
  };

  return (
    <Box sx={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}>
      {!login
        ? <Box>
            <SessionButton variant="outlined" color="primary" onClick={clickMenuAction}>
              Log in
            </SessionButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenuAction}>
              <MenuItem onClick={() => { setSolidLoginDialog(true); closeMenuAction(); }}>
                <ListItemIcon>
                  <Icon sx={{ display: "flex" }}>
                    <img src={SESSION_SOLID_ICON} alt="Solid logo" />
                  </Icon>
                </ListItemIcon>
                <Typography>Solid</Typography>
              </MenuItem>
            </Menu>
          </Box>
        : <SessionButton variant="outlined" color="success" onClick={sessionAction}>
            {sessionLabel()}
          </SessionButton>
      }
      {solidLoginDialog && <SolidLoginDialog onHide={() => { setSolidLoginDialog(false); }} />}
    </Box>
  );
}
