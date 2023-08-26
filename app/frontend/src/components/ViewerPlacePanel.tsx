import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./_shared/_menus";
import LoadingStub from "./_shared/LoadingStub";
import ViewerPlaceContent from "./viewer/ViewerPlaceContent";

/**
 * Panel for viewing stored places.
 */
export default function ViewerPlacePanel(): JSX.Element {

  const { place } = useAppSelector((state) => state.viewer);
  const { loaded } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ mx: 2, my: 4 }}>
        {loaded
          ? <Box>
              {place
                ? <ViewerPlaceContent place={place} />
                : <Alert severity={"warning"}>
                    There is nothing to show.
                  </Alert>
              }
            </Box>
          : <LoadingStub />
        }
      </Box>
    </Box>
  );
}
