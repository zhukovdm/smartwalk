import { Alert, Box } from "@mui/material";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./shared/_menus";
import LoadStub from "./result/LoadStub";
import ViewerRouteContent from "./viewer/ViewerRouteContent";

export default function ViewerRoutePanel(): JSX.Element {

  const { loaded } = useAppSelector((state) => state.favorites);
  const {
    route,
    routeFilters
  } = useAppSelector((state) => state.viewer);

  return (
    <Box>
      <BackCloseMenu />
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
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
