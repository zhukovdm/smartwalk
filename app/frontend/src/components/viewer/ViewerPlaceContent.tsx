import { useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Divider,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { UiPlace } from "../../domain/types";
import PlaceLocation from "../entity/PlaceLocation";
import { getSmartPlaceLink } from "../../domain/functions";
import PlaceKeywords from "../entity/PlaceKeywords";

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
        <Typography fontSize={"large"}>
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
