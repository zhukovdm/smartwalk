import { useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import { StoredPlace } from "../../domain/types";
import { getSmartPlaceLink } from "../../utils/functions";
import PlaceKeywords from "../_shared/PlaceKeywords";
import PlaceLocation from "../_shared/PlaceLocation";

export type ViewerPlaceContentProps = {

  /** Place to view */
  place: StoredPlace;
};

/**
 * Read-only view of a stored place.
 */
export default function ViewerPlaceContent(
  { place }: ViewerPlaceContentProps): JSX.Element {

  const { smartId, name } = place;
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
          {(!smartId)
            ? name
            : <Link component={RouterLink} to={getSmartPlaceLink(smartId)!} underline={"hover"}>{name}</Link>
          }
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
