import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { toggleFavoriteDirecsExpanded } from "../../features/favoritesSlice";
import ExpandSectionIcon from "../shared/ExpandSectionIcon";
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
