import { Alert, Box } from "@mui/material";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./shared/_menus";
import LoadStub from "./result/LoadStub";
import ResultPlacesContent from "./result/ResultPlacesContent";

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
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
