import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { toggleFavoriteDirecsExpanded } from "../../features/favoritesSlice";
import ExpandSectionIcon from "../_shared/ExpandSectionIcon";
import MyDirecsList from "./MyDirecsList";

/**
 * Collapsible section with list of directions available in the storage.
 */
export default function MyDirecsSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const { direcsExpanded } = useAppSelector((state) => state.favorites);

  return (
    <Accordion
      expanded={direcsExpanded}
      onChange={() => { dispatch(toggleFavoriteDirecsExpanded()); }}
    >
      <AccordionSummary
        id={"favorites-my-direcs-head"}
        aria-controls={"favorites-my-direcs-cont"}
        expandIcon={<ExpandSectionIcon expanded={direcsExpanded} />}
      >
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyDirecsList />
      </AccordionDetails>
    </Accordion>
  );
}
