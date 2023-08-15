import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { StoredPlace, UiDirec } from "../../domain/types";
import { useAppSelector } from "../../features/hooks";
import { SteadyPlaceListItem } from "../shared/list-items";
import SaveDirecDialog from "./SaveDirecDialog";

type ResultDirecsContentProps = {

  /** Direction object. */
  result: UiDirec;
};

/**
 * Component presenting the content of a direction search result.
 */
export default function ResultDirecsContent({ result }: ResultDirecsContentProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { places } = useAppSelector(state => state.favourites);

  const [saveDialog, setSaveDialog] = useState(false);

  const {
    direcId,
    name,
    path,
    waypoints: sequence
  } = result;

  const knownPlaces = useMemo(() => {
    return places.reduce((str, place) => { return str.set(place.placeId, place) }, new Map<string, StoredPlace>());
  }, [places]);

  useEffect(() => {
    map?.clear();
    sequence.forEach((place) => {
      place.placeId && knownPlaces.has(place.placeId)
        ? map?.addStored(knownPlaces.get(place.placeId)!)
        : map?.addCustom(place, false);
    });
    map?.drawPolyline(path.polyline);
  }, [map, path, sequence, knownPlaces])

  return (
    <Stack direction="column" gap={2.7}>
      {(direcId)
        ? <Alert severity="success">
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Box>
            <Alert
              icon={false}
              severity="info"
              action={<Button color="inherit" size="small" onClick={() => { setSaveDialog(true); }}>Save</Button>}
            >
              Would you like to save this direction?
            </Alert>
            {saveDialog && <SaveDirecDialog direc={result} onHide={() => { setSaveDialog(false); }} />}
          </Box>
      }
      <Box display="flex" alignItems="center">
        <Typography fontSize="1.2rem">
          Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(path.distance.toFixed(2))}</strong> km
        </Typography>
      </Box>
      <Stack direction="column" gap={2}>
        {sequence
          .map((place, i) => {
            const pt = place.placeId ? knownPlaces.get(place.placeId) : undefined;
            return (pt)
              ? <SteadyPlaceListItem  
                  key={i}
                  kind="stored"
                  label={pt.name}
                  onPlace={() => { map?.flyTo(pt); }}
                />
              : <SteadyPlaceListItem
                  key={i}
                  kind="custom"
                  label={place.name}
                  onPlace={() => { map?.flyTo(place); }}
                />
          })
        }
      </Stack>
    </Stack>
  );
}
