import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { AppContext } from "../App";
import {
  FAVORITES_ADDR,
  SESSION_SOLID_ADDR
} from "../utils/routing";
import { resetFavorites } from "../features/favoritesSlice";
import { showPanel } from "../features/panelSlice";
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
import { useAppDispatch, useAppSelector } from "../features/storeHooks";
import DeviceStorage from "../utils/deviceStorage";
import {
  solidRedirect as solidRedirectCallback
} from "../utils/solidProvider";
import SolidLoginDialog from "./session/SolidLoginDialog";

const ASSETS_FOLDER = process.env.PUBLIC_URL + "/assets";
const SESSION_SOLID_ICON = ASSETS_FOLDER + "/solid/logo.svg";

const SessionButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  }
}));

/**
 * Menu and dialogs for supported remote storage providers (Solid, etc.).
 */
export default function SessionProvider(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const context = useContext(AppContext);

  // state

  const { login, solid } = useAppSelector((state) => state.session);

  // menu

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const clickMenuAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => { setAnchorEl(null); };

  // solid

  const {
    redirect: solidRedirect
  } = useAppSelector((state) => state.solid);

  const [solidLoginDialog, setSolidLoginDialog] = useState(false);

  useEffect(() => {
    if (!solidRedirect) {
      solidRedirectCallback(
        (webId: string) => {
          dispatch(setSessionLogin());
          dispatch(setSessionSolid());
          dispatch(setSolidWebId(webId));
          navigate(SESSION_SOLID_ADDR);
        },
        (error: string | null) => {
          alert(`[Solid error] ${error}`);
        },
        () => {
          dispatch(resetSolid());
          dispatch(resetSession());
          dispatch(resetFavorites());
          context.storage = new DeviceStorage();
          navigate(FAVORITES_ADDR);
        }
      );
      dispatch(setSolidRedirect());
    }
  }, [navigate, dispatch, context, solidRedirect]);

  // session

  const sessionLabel = () => {
    if (solid) {
      return "Solid";
    }
    return undefined;
  }

  const sessionAction = () => {
    dispatch(showPanel());
    if (solid) {
      navigate(SESSION_SOLID_ADDR);
    }
  };

  const bid = `smartwalk-session-menu-button`;
  const mid = `smartwalk-session-menu`;

  return (
    <Box
      sx={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}
    >
      {(!login)
        ? <Box>
            <SessionButton
              id={bid}
              onClick={clickMenuAction}
              variant={"outlined"}
              color={"primary"}
              aria-haspopup={"listbox"}
              aria-expanded={open}
              aria-controls={open ? mid : undefined}
            >
              <span>Log in</span>
            </SessionButton>
            <Menu
              id={mid}
              aria-labelledby={bid}
              open={open}
              anchorEl={anchorEl}
              onClose={closeMenuAction}
            >
              <MenuItem
                onClick={() => { setSolidLoginDialog(true); closeMenuAction(); }}
              >
                <ListItemIcon>
                  <Icon sx={{ display: "flex" }}>
                    <img
                      alt={"solid/logo.svg"}
                      src={SESSION_SOLID_ICON}
                    />
                  </Icon>
                </ListItemIcon>
                <Typography>Solid</Typography>
              </MenuItem>
            </Menu>
          </Box>
        : <SessionButton
            variant={"outlined"}
            color={"success"}
            onClick={sessionAction}
            title={`${sessionLabel()} session`}
          >
            {sessionLabel()}
          </SessionButton>
      }
      <SolidLoginDialog
        show={solidLoginDialog}
        onHide={() => { setSolidLoginDialog(false); }}
      />
    </Box>
  );
}
