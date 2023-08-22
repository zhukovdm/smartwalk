import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { toggleFavoritePlacesExpanded } from "../../features/favoritesSlice";
import ExpandSectionIcon from "../shared/ExpandSectionIcon";
import MyPlacesList from "./MyPlacesList";
import MyPlacesCreateDialog from "./MyPlacesCreateDialog";

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
      <AccordionSummary
        expandIcon={<ExpandSectionIcon expanded={placesExpanded} />}
      >
        <Typography>My Places</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyPlacesList />
        <MyPlacesCreateDialog />
      </AccordionDetails>
    </Accordion>
  );
}
