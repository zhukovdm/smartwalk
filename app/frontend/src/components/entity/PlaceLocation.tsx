import { Box, Typography } from "@mui/material";
import { IMap } from "../../domain/interfaces";
import { UiPlace } from "../../domain/types";
import { PlaceButton } from "../shared/_buttons";
import { point2text } from "../../utils/helpers";

type PlaceLocationProps = {
  map: IMap | undefined;
  place: UiPlace;
  isStored: boolean;
};

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
