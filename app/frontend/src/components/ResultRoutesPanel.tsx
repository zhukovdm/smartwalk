import { Alert, Box } from "@mui/material";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./shared/_menus";
import LoadStub from "./result/LoadStub";
import ResultRoutesContent from "./result/ResultRoutesContent";


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
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
