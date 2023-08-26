import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./_shared/_menus";
import LoadingStub from "./_shared/LoadingStub";
import ResultPlacesContent from "./result/ResultPlacesContent";

/**
 * Panel containing the latest result of a place search.
 */
export default function ResultPlacesPanel(): JSX.Element {

  const { loaded } = useAppSelector((state) => state.favorites);
  const { result } = useAppSelector((state) => state.resultPlaces);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ mx: 2, my: 4 }}>
        {loaded
          ? <Box>
              {result && result.places.length > 0
                ? <ResultPlacesContent result={result} />
                : <Alert severity={"warning"}>
                    The result appears to be empty. Try different search parameters.
                  </Alert>
              }
            </Box>
          : <LoadingStub />
        }
      </Box>
    </Box>
  );
}
