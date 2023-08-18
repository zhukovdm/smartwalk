import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, CircularProgress } from "@mui/material";
import { AppContext } from "../App";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { useAppSelector } from "../features/store";
import { BackCloseMenu } from "./shared/_menus";
import PlaceContent from "./entity/PlaceContent";

/**
 * Panel presenting a place, with menu, and content.
 */
export default function EntityPlacePanel(): JSX.Element {

  const id = useParams().id!; // (!) non-empty

  const entityPlaces = useContext(AppContext).smart.entityPlaces;

  const { loaded: favoritesLoaded } = useAppSelector((state) => state.favorites);

  const [place, setPlace] = useState(entityPlaces.get(id));
  const [placeLoaded, setPlaceLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        if (!place && !placeLoaded) {
          const p = await SmartWalkFetcher.entityPlaces(id);
          if (p && !ignore) {
            setPlace(p);
            entityPlaces.set(id, p);
          }
        }
      }
      catch (ex) { alert(ex); }
      finally {
        if (!ignore) { setPlaceLoaded(true); }
      }
    };

    load();
    return () => { ignore = true; }
  }, [id, entityPlaces, place, placeLoaded]);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ mx: 2, my: 4 }}>
        {(favoritesLoaded && placeLoaded)
          ? <Box>
              {(place)
                ? <PlaceContent place={place} />
                : <Alert severity={"warning"}>Either an entity does not exist, or a communication error occurred.</Alert>
              }
            </Box>
          : <Box display={"flex"} justifyContent={"center"}>
              <CircularProgress />
            </Box>
        }
      </Box>
    </Box>
  );
}
