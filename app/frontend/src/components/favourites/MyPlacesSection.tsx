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
  setFavouritePlacesLoaded
} from "../../features/favouritesSlice";
import MyPlacesList from "./MyPlacesList";
import MyPlacesCreateDialog from "./MyPlacesCreateDialog";

/**
 * Collapsible section with list of places available in the storage.
 */
export default function MyPlacesSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { places, placesLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        try {
          dispatch(setFavouritePlaces(await storage.getAllPlaces()));
          dispatch(setFavouritePlacesLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, placesLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Places</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {placesLoaded
          ? <MyPlacesList places={places} />
          : <Skeleton variant="rounded" height={100} />
        }
        <MyPlacesCreateDialog />
      </AccordionDetails>
    </Accordion>
  );
}
