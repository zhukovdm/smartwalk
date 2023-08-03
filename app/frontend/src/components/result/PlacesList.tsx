import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
import { Favorite, Link } from "@mui/icons-material";
import { AppContext } from "../../App";
import { Place, StoredPlace } from "../../domain/types";
import { useAppDispatch } from "../../features/hooks";
import { BusyListItem } from "../shared/list-items";
import { setEntityBack } from "../../features/entitySlice";
import { ENTITY_ADDR } from "../../domain/routing";
import { PlaceButton } from "../shared/buttons";

type ListItemLinkProps = {

  /** Menu icon presented to the user. */
  icon: JSX.Element;

  /** Link back to the panel */
  back: string;

  /** Id known by the server. */
  grainId: string;
};

function ListItemLink({ icon, back, grainId }: ListItemLinkProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(setEntityBack(back));
    navigate(ENTITY_ADDR + "/" + grainId);
  };

  return (
    <IconButton size="small" onClick={onClick}>
      {icon}
    </IconButton>
  );
}

type PlacesListProps = {

  /** Address of the back navigation. */
  back: string;

  /** List of places. */
  places: Place[];

  /** Known places with grainId appearing in the storage. */
  grains: Map<string, StoredPlace>;
};

/**
 * List of places as per presented in the result.
 */
export default function PlacesList({ back, places, grains }: PlacesListProps): JSX.Element {

  const { map } = useContext(AppContext);

  return (
    <Stack direction="column" gap={2}>
      {places
        .map((place, i) => {
          const grain = grains.get(place.grainId);
          return (grain)
            ? <BusyListItem
                key={i}
                label={grain.name}
                l={<PlaceButton kind="stored" onPlace={() => { map?.flyTo(grain); }} />}
                r={<ListItemLink icon={<Favorite />} back={back} grainId={place.grainId} />}
              />
            : <BusyListItem
                key={i}
                label={place.name}
                l={<PlaceButton kind="tagged" onPlace={() => { map?.flyTo(place); }} />}
                r={<ListItemLink icon={<Link />} back={back} grainId={place.grainId} />}
              />
        })
      }
    </Stack>
  );
}
