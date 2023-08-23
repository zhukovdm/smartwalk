import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Pagination,
  Stack,
  Typography
} from "@mui/material";
import { UiDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { setResultDirecsIndex } from "../../features/resultDirecsSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import SaveDirecDialog from "./SaveDirecDialog";
import { useResultDirecsMap } from "../../features/resultHooks";
import TraversableDistance from "./TraversableDistance";
import ResultDirecsContentList from "./ResultDirecsContentList";

type ResultDirecsContentProps = {

  /** Direction object. */
  result: UiDirec[];
};

/**
 * Component presenting the content of a direction search result.
 */
export default function ResultDirecsContent(
  { result }: ResultDirecsContentProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { index } = useAppSelector((state) => state.resultDirecs);

  const [saveDialog, setSaveDialog] = useState(false);

  const {
    direcId,
    name,
    path,
    waypoints
  } = result[index];

  const places = usePlaces(waypoints, useStoredPlaces(), useStoredSmarts());

  const map = useResultDirecsMap(places, path);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultDirecsIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Typography fontSize={"1.1rem"}>
        Found a total of <strong>{result.length}</strong> direction{result.length > 1 ? "s" : ""}.
      </Typography>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={index + 1}
          count={result.length}
          onChange={onPage}
        />
      </Box>
      {(direcId)
        ? <Alert severity={"success"}>
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Box>
            <Alert
              icon={false}
              severity={"info"}
              action={
                <Button
                  color={"inherit"}
                  size={"small"}
                  onClick={() => { setSaveDialog(true); }}
                >
                  <span>Save</span>
                </Button>}
            >
              Would you like to save this direction?
            </Alert>
            {saveDialog && (<SaveDirecDialog direc={result[index]} index={index} onHide={() => { setSaveDialog(false); }} />)}
          </Box>
      }
      <TraversableDistance distance={path.distance} />
      <ResultDirecsContentList
        map={map}
        places={places}
      />
    </Stack>
  );
}
