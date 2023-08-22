import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { toggleFavoriteRoutesExpanded } from "../../features/favoritesSlice";
import ExpandSectionIcon from "../shared/ExpandSectionIcon";
import MyRoutesList from "./MyRoutesList";

/**
 * Collapsible section with list of routes available in the storage.
 */
export default function MyRoutesSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const { routesExpanded } = useAppSelector((state) => state.favorites);

  return (
    <Accordion
      expanded={routesExpanded}
      onChange={() => { dispatch(toggleFavoriteRoutesExpanded()) }}
    >
      <AccordionSummary
        expandIcon={<ExpandSectionIcon expanded={routesExpanded} />}
      >
        <Typography>My Routes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyRoutesList />
      </AccordionDetails>
    </Accordion>
  );
}
