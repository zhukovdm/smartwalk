import { Alert, Box } from "@mui/material";
import { useAppSelector } from "../features/store";
import { BackCloseMenu } from "./shared/_menus";
import LoadStub from "./result/LoadStub";
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
              {result
                ? <ResultDirecsContent result={result} />
                : <Alert>
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
