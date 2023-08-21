import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import MyDirecsList from "./MyDirecsList";

/**
 * Collapsible section with list of directions available in the storage.
 */
export default function MyDirecsSection(): JSX.Element {

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyDirecsList />
      </AccordionDetails>
    </Accordion>
  );
}
