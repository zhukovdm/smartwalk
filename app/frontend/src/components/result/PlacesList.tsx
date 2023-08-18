import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
import { Favorite, Link } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace, UiPlace } from "../../domain/types";
import { BusyListItem } from "../shared/_list-items";
import { ENTITY_PLACES_ADDR } from "../../domain/routing";
import { PlaceButton } from "../shared/_buttons";

type ListItemLinkProps = {

  /** Menu icon presented to the user. */
  icon: JSX.Element;

  /** Id known by the server. */
  smartId: string;
};

function ListItemLink({ icon, smartId }: ListItemLinkProps): JSX.Element {

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`${ENTITY_PLACES_ADDR}/${smartId}`);
  };

  return (
    <IconButton size={"small"} onClick={onClick}>
      {icon}
    </IconButton>
  );
}

type PlacesListProps = {

  /** List of places. */
  places: UiPlace[];

  /** Known places with grainId appearing in the storage. */
  smarts: Map<string, StoredPlace>;
};

/**
 * List of places as per presented in the result.
 */
export default function PlacesList({ places, smarts }: PlacesListProps): JSX.Element {

  const { map } = useContext(AppContext);

  return (
    <Stack direction={"column"} gap={2}>
      {places
        .map((place, i) => {
          const sid = place.smartId!;
          const smart = smarts.get(sid);
          return (smart)
            ? <BusyListItem
                key={i}
                label={smart.name}
                l={<PlaceButton kind={"stored"} onPlace={() => { map?.flyTo(smart); }} />}
                r={<ListItemLink icon={<Favorite />} smartId={sid} />}
              />
            : <BusyListItem
                key={i}
                label={place.name}
                l={<PlaceButton kind={"tagged"} onPlace={() => { map?.flyTo(place); }} />}
                r={<ListItemLink icon={<Link />} smartId={sid} />}
              />
        })
      }
    </Stack>
  );
}
