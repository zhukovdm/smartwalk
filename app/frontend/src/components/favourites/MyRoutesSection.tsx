import { useContext, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { AppContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded,
  setFavouriteRoutes,
  setFavouriteRoutesLoaded
} from "../../features/favouritesSlice";
import MyRoutesList from "./MyRoutesList";

export default function MyRoutesSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    placesLoaded,
    routes,
    routesLoaded
  } = useAppSelector(state => state.favourites);

  const { storage } = useContext(AppContext);

  useEffect(() => {
    const load = async () => {
      if (!routesLoaded) {
        try {
          dispatch(setFavouriteRoutes(await storage.getAllRoutes()));
          dispatch(setFavouriteRoutesLoaded());
        }
        catch (ex) { alert(ex); }
      }
      if (!placesLoaded) {
        try {
          dispatch(setFavouritePlaces(await storage.getAllPlaces()));
          dispatch(setFavouritePlacesLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, placesLoaded, routesLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Routes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {routesLoaded
          ? <MyRoutesList routes={routes} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
