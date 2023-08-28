import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import BackCloseBar from "./_shared/BackCloseBar";
import LoadingStub from "./_shared/LoadingStub";
import ViewerRouteContent from "./viewer/ViewerRouteContent";

/**
 * Panel for viewing stored routes.
 */
export default function ViewerRoutePanel(): JSX.Element {

  const { loaded } = useAppSelector((state) => state.favorites);
  const {
    route,
    routeFilters
  } = useAppSelector((state) => state.viewer);

  return (
    <Box>
      <BackCloseBar />
      <Box sx={{ mx: 2, my: 4 }}>
        {loaded
          ? <Box>
              {route
                ? <ViewerRouteContent
                  route={route}
                  filterList={routeFilters}
                />
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
