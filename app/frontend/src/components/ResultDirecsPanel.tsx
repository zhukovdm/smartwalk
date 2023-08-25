import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./shared/_menus";
import LoadingStub from "./shared/LoadingStub";
import ResultDirecsContent from "./result/ResultDirecsContent";

export default function ResultDirecsPanel(): JSX.Element {

  const { loaded } = useAppSelector((state) => state.favorites);
  const { result } = useAppSelector((state) => state.resultDirecs);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ mx: 2, my: 4 }}>
        {loaded
          ? <Box>
              {result.length > 0
                ? <ResultDirecsContent result={result} />
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
