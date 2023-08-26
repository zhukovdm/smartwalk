import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./_shared/_menus";
import SolidContent from "./session/SolidContent";
import SolidPodLink from "./session/SolidPodLink";

/**
 * Panel corresponding to Solid storage provider.
 */
export default function SessionSolidPanel(): JSX.Element {

  const {
    login,
    solid
  } = useAppSelector((state) => state.session);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ m: 2 }}>
        {login && solid
          ? <SolidContent />
          : <Alert severity="info">
              Log in to your <SolidPodLink /> to see the content.
            </Alert>
        }
      </Box>
    </Box>
  );
}
