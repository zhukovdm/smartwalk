import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { PlaceButton } from "./_buttons";
import { point2text } from "../../utils/helpers";

type PlaceLocationProps = {

  /** Current map */
  map: IMap | undefined;

  /** Place in consideration. */
  place: UiPlace;

  /** Flag saying whether place appears in storage. */
  isStored: boolean;
};

/**
 * Small place location with `Fly to` in a place view.
 */
export default function PlaceLocation(
  { map, place, isStored }: PlaceLocationProps): JSX.Element {

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
    >
      <Box></Box>
      <Box
        alignItems={"center"}
        display={"flex"}
        onClick={() => { map?.flyTo(place); }}
        sx={{ cursor: "pointer" }}
      >
        <PlaceButton
          kind={isStored ? "stored" : "common"}
          title={"Fly to"}
          onPlace={() => {}}
        />
        <Typography fontSize={"small"}>
          {point2text(place.location)}
        </Typography>
      </Box>
    </Box>
  );
}
