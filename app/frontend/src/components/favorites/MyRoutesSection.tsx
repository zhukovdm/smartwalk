import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import {
  toggleFavoriteRoutesExpanded
} from "../../features/favoritesSlice";
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
        id={"favorites-my-routes-head"}
        aria-controls={"favorites-my-routes-cont"}
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
