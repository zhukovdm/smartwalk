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
  setFavouriteDirecs,
  setFavouriteDirecsLoaded,
  setFavouriteRoutes,
  setFavouriteRoutesLoaded
} from "../../features/favouritesSlice";
import MyDirecsList from "./MyDirecsList";

export default function MyDirecsSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const {
    direcs,
    direcsLoaded,
    placesLoaded
  } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        try {
          dispatch(setFavouriteRoutes(await storage.getAllRoutes()));
          dispatch(setFavouriteRoutesLoaded());
        }
        catch (ex) { alert(ex); }
      }
      if (!direcsLoaded) {
        try {
          dispatch(setFavouriteDirecs(await storage.getAllDirecs()));
          dispatch(setFavouriteDirecsLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, placesLoaded, direcsLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {direcsLoaded
          ? <MyDirecsList direcs={direcs} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
