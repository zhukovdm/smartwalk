import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./_shared/_menus";
import LoadingStub from "./_shared/LoadingStub";
import ResultRoutesContent from "./result/ResultRoutesContent";

/**
 * Panel containing the latest result of a route search.
 */
export default function ResultRoutesPanel(): JSX.Element {

  const { loaded } = useAppSelector((state) => state.favorites);
  const { result } = useAppSelector((state) => state.resultRoutes);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ mx: 2, my: 4 }}>
        {(loaded)
          ? <Box>
              {result.length > 0
                ? <ResultRoutesContent result={result} />
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
