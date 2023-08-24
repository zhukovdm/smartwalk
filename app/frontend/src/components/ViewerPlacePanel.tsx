import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./shared/_menus";
import LoadStub from "./result/LoadStub";
import ViewerPlaceContent from "./viewer/ViewerPlaceContent";

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
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
