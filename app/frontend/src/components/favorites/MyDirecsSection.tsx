import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppSelector } from "../../features/store";
import MyDirecsList from "./MyDirecsList";

export default function MyDirecsSection(): JSX.Element {

  const { direcs, places } = useAppSelector((state) => state.favorites);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MyDirecsList direcs={direcs} places={places} />
      </AccordionDetails>
    </Accordion>
  );
}
