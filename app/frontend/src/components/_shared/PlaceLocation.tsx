import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { point2text } from "../../utils/helpers";
import PlaceButton from "./PlaceButton";

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
      justifyContent={"right"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={0}
      >
        <PlaceButton
          kind={isStored ? "stored" : "common"}
          title={"Fly to"}
          onClick={() => { map?.flyTo(place); }}
        />
        <Typography
          fontSize={"small"}
          sx={{ cursor: "pointer" }}
          aria-hidden
          onClick={() => { map?.flyTo(place); }}
        >
          {point2text(place.location)}
        </Typography>
      </Stack>
    </Box>
  );
}
