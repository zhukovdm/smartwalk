import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Pagination,
  Stack,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { UiDirec } from "../../domain/types";
import { isPlaceStored } from "../../domain/functions";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { setResultDirecsIndex } from "../../features/resultDirecsSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { FixedPlaceListItem } from "../shared/_list-items";
import SaveDirecDialog from "./SaveDirecDialog";

type ResultDirecsContentProps = {

  /** Direction object. */
  result: UiDirec[];
};

/**
 * Component presenting the content of a direction search result.
 */
export default function ResultDirecsContent({ result }: ResultDirecsContentProps): JSX.Element {

  const { map } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { index } = useAppSelector((state) => state.resultDirecs);

  const [saveDialog, setSaveDialog] = useState(false);

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();
  const {
    direcId,
    name,
    path,
    waypoints: resultWaypoints
  } = result[index];

  const waypoints = usePlaces(resultWaypoints, storedPlaces, storedSmarts);

  useEffect(() => {
    map?.clear();
    waypoints.forEach((waypoint) => {
      (isPlaceStored(waypoint, storedPlaces, storedSmarts))
        ? map?.addStored(waypoint, [])
        : map?.addCommon(waypoint, [], false);
    });
    map?.drawPolyline(path.polyline);
  }, [map, path, waypoints, storedPlaces, storedSmarts]);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultDirecsIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.7}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
      >
        <Pagination
          count={result.length}
          page={index + 1}
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
            {saveDialog && <SaveDirecDialog direc={result[index]} index={index} onHide={() => { setSaveDialog(false); }} />}
          </Box>
      }
      <Box display={"flex"} alignItems={"center"}>
        <Typography fontSize={"1.2rem"}>
          Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(path.distance.toFixed(2))}</strong> km
        </Typography>
      </Box>
      <Stack direction={"column"} gap={2}>
        {waypoints
          .map((waypoint, i) => (
            <FixedPlaceListItem  
              key={i}
              kind={isPlaceStored(waypoint, storedPlaces, storedSmarts) ? "stored" : "common"}
              label={waypoint.name}
              onPlace={() => { map?.flyTo(waypoint); }}
            />
          ))
        }
      </Stack>
    </Stack>
  );
}
