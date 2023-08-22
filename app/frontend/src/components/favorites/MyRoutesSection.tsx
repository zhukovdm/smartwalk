import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import MyRoutesList from "./MyRoutesList";
import { toggleFavoriteRoutesExpanded } from "../../features/favoritesSlice";

/**
 * Collapsible section with list of routes available in the storage.
 */
export default function MyRoutesSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const { places, routes, routesExpanded } = useAppSelector((state) => state.favorites);

  return (
    <Accordion
      expanded={routesExpanded}
      onChange={() => { dispatch(toggleFavoriteRoutesExpanded()) }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Routes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyRoutesList routes={routes} places={places} />
      </AccordionDetails>
    </Accordion>
  );
}
