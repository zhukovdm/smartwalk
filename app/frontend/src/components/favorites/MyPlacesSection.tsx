import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@mui/material/Divider";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import {
  toggleFavoritePlacesExpanded
} from "../../features/favoritesSlice";
import ExpandSectionIcon from "../_shared/ExpandSectionIcon";
import MyPlacesList from "./MyPlacesList";
import MyPlacesCreateDialog from "./MyPlacesCreateDialog";

/**
 * Collapsible section with list of places available in the storage.
 */
export default function MyPlacesSection(): JSX.Element {

  const dispatch = useAppDispatch();
  const { placesExpanded } = useAppSelector((state) => state.favorites);

  const [head, cont] = ["head", "cont"]
    .map((item) => `smartwalk-favorites-my-places-${item}`);

  return (
    <Accordion
      expanded={placesExpanded}
      onChange={() => { dispatch(toggleFavoritePlacesExpanded()); }}
    >
      <AccordionSummary
        aria-label={"My Places"}
        id={head}
        aria-controls={cont}
        expandIcon={<ExpandSectionIcon expanded={placesExpanded} />}
      >
        <Typography>My Places</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyPlacesList aria-labelledby={head} />
        <Divider />
        <MyPlacesCreateDialog />
      </AccordionDetails>
    </Accordion>
  );
}
