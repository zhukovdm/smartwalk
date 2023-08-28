import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import BackCloseBar from "./_shared/BackCloseBar";
import LoadingStub from "./_shared/LoadingStub";
import ViewerDirecContent from "./viewer/ViewerDirecContent";

/**
 * Panel for viewing stored directions.
 */
export default function ViewerDirecPanel(): JSX.Element {

  const { direc } = useAppSelector((state) => state.viewer);
  const { loaded } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      <BackCloseBar />
      <Box sx={{ mx: 2, my: 4 }}>
        {loaded
          ? <Box>
              {direc
                ? <ViewerDirecContent direc={direc} />
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
