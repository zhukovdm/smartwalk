import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import MyPlacesList from "./MyPlacesList";
import MyPlacesCreateDialog from "./MyPlacesCreateDialog";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { toggleFavoritePlacesExpanded } from "../../features/favoritesSlice";

/**
 * Collapsible section with list of places available in the storage.
 */
export default function MyPlacesSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const { placesExpanded } = useAppSelector((state) => state.favorites);

  return (
    <Accordion
      expanded={placesExpanded}
      onChange={() => { dispatch(toggleFavoritePlacesExpanded()); }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Places</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyPlacesList />
        <MyPlacesCreateDialog />
      </AccordionDetails>
    </Accordion>
  );
}
