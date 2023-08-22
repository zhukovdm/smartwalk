import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import MyPlacesList from "./MyPlacesList";
import MyPlacesCreateDialog from "./MyPlacesCreateDialog";

/**
 * Collapsible section with list of places available in the storage.
 */
export default function MyPlacesSection(): JSX.Element {

  return (
    <Accordion defaultExpanded>
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
