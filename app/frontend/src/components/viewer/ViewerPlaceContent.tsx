import { useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import { UiPlace } from "../../domain/types";
import { getSmartPlaceLink } from "../../domain/functions";
import PlaceKeywords from "../shared/PlaceKeywords";
import PlaceLocation from "../shared/PlaceLocation";

type ViewerPlaceContentProps = {
  place: UiPlace;
};

export default function ViewerPlaceContent(
  { place }: ViewerPlaceContentProps): JSX.Element {

  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    map?.addStored(place, []);
    map?.flyTo(place);
  }, [map, place]);

  return (
    <Stack gap={2.5}>
      <Stack gap={1}>
        <Typography
          fontSize={"1.25rem"}
          fontWeight={"medium"}
        >
          {!place.smartId ? place.name : <Link component={RouterLink} to={getSmartPlaceLink(place.smartId)!} underline={"hover"}>{place.name}</Link>}
        </Typography>
        <Divider sx={{ background: "lightgray" }} />
        <PlaceLocation
          map={map}
          place={place}
          isStored
        />
      </Stack>
      {place.keywords.length > 0 && <PlaceKeywords keywords={place.keywords} />}
    </Stack>
  );
}
