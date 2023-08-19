import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppSelector } from "../../features/storeHooks";
import MyRoutesList from "./MyRoutesList";

export default function MyRoutesSection(): JSX.Element {

  const { places, routes } = useAppSelector((state) => state.favorites);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Routes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyRoutesList routes={routes} places={places} />
      </AccordionDetails>
    </Accordion>
  );
}
