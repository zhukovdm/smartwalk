import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import {
  toggleFavoriteDirecsExpanded
} from "../../features/favoritesSlice";
import ExpandSectionIcon from "../_shared/ExpandSectionIcon";
import MyDirecsList from "./MyDirecsList";

/**
 * Collapsible section with list of directions available in the storage.
 */
export default function MyDirecsSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const { direcsExpanded } = useAppSelector((state) => state.favorites);

  const [head, cont] = ["head", "cont"]
    .map((item) => `smartwalk-favorites-my-direcs-${item}`);

  return (
    <Accordion
      expanded={direcsExpanded}
      onChange={() => { dispatch(toggleFavoriteDirecsExpanded()); }}
    >
      <AccordionSummary
        id={head}
        aria-controls={cont}
        expandIcon={<ExpandSectionIcon expanded={direcsExpanded} />}
      >
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyDirecsList aria-labelledby={head} />
      </AccordionDetails>
    </Accordion>
  );
}
