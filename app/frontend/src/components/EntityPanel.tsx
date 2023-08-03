import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Skeleton, Stack } from "@mui/material";
import { AppContext } from "../App";
import { GrainPathFetcher } from "../utils/grainpath";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared/menus";
import EntityContent from "./entity/EntityContent";

/**
 * Panel presenting an entity, with menu, and content.
 */
export default function EntityPanel(): JSX.Element {

  const id = useParams().id!; // (!) non-empty

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storage = useContext(AppContext).storage;
  const entities = useContext(AppContext).grain.entity;

  const { back } = useAppSelector(state => state.entity);
  const { placesLoaded } = useAppSelector((state) => state.favourites);

  const [entity, setEntity] = useState(entities.get(id));
  const [entityLoaded, setEntityLoaded] = useState(false);

  // ensure known places are loaded from the storage
  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        dispatch(setFavouritePlaces(await storage.getAllPlaces()));
        dispatch(setFavouritePlacesLoaded());
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  // ensure an entity is loaded from the server
  useEffect(() => {
    const load = async () => {
      try {
        if (!entity && !entityLoaded) {
          const e = await GrainPathFetcher.fetchEntity(id);
          if (e) { setEntity(e); entities.set(id, e); }
        }
      }
      catch (ex) { alert(ex); }
      finally { setEntityLoaded(true); }
    };
    load();
  }, [id, entities, entity, entityLoaded]);

  return (
    <Box>
      <BackCloseMenu onBack={back ? () => { navigate(back); } : undefined} />
      <Box sx={{ mx: 2, my: 4 }}>
        {(placesLoaded && (entity || entityLoaded))
          ? <Box>
              {(entity)
                ? <EntityContent entity={entity} />
                : <Alert severity="warning">Either an entity does not exist, or a communication error occurred.</Alert>
              }
            </Box>
          : <Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={ 50} />
              <Skeleton variant="rounded" height={100} />
              <Skeleton variant="rounded" height={100} />
            </Stack>
        }
      </Box>
    </Box>
  );
}
