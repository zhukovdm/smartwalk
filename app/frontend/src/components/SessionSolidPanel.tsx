import { Alert, Box } from "@mui/material";
import { useAppSelector } from "../features/store";
import SolidContent from "./session/SolidContent";
import SolidPodLink from "./session/SolidPodLink";
import { BackCloseMenu } from "./shared/_menus";

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
