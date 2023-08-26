import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { SEARCH_ROUTES_ADDR } from "../domain/routing";
import { LogoCloseMenu } from "./_shared/_menus";

/**
 * Panel shown for all unknown URLs.
 */
export default function NotFoundPanel(): JSX.Element {

  const nav = useNavigate();

  return (
    <Box>
      <LogoCloseMenu onLogo={() => { nav(SEARCH_ROUTES_ADDR); }} />
      <Box sx={{ mx: 2, my: 4 }}>
        <Alert color="warning">Oops! Unknown address...</Alert>
      </Box>
    </Box>
  );
}
