import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Grain } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace } from "../../domain/types";
import {
  ENTITY_ADDR,
  FAVOURITES_ADDR,
  SEARCH_PLACES_ADDR
} from "../../domain/routing";
import { useAppDispatch } from "../../features/hooks";
import { setEntityBack } from "../../features/entitySlice";
import {
  updateFavouritePlace,
  deleteFavouritePlace
} from "../../features/favouritesSlice";
import { PlaceButton } from "../shared/buttons";
import { BusyListItem } from "../shared/list-items";
import DeleteSomethingDialog from "./DeleteSomethingDialog";
import UpdateSomethingDialog from "./UpdateSomethingDialog";
import ListItemMenu from "./ListItemMenu";
import FavouriteStub from "./FavouriteStub";

type MyPlacesListItemProps = {

  /** The position of the place in the list. */
  index: number;

  /** Place object. */
  place: StoredPlace;
};

function MyPlacesListItem({ index, place }: MyPlacesListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const [showD, setShowD] = useState(false);
  const [showU, setShowU] = useState(false);

  const onPlace = () => {
    map?.clear();
    map?.addStored(place);
    map?.flyTo(place);
  };

  const onShow = () => {
    dispatch(setEntityBack(FAVOURITES_ADDR));
    navigate(ENTITY_ADDR + "/" + place.smartId);
  };

  const onUpdate = async (name: string): Promise<void> => {
    const pl = { ...place, name: name };
    await storage.updatePlace(pl);
    dispatch(updateFavouritePlace({ place: pl, index: index }));
  };

  const onDelete = async (): Promise<void> => {
    await storage.deletePlace(place.placeId);
    dispatch(deleteFavouritePlace(index));
  };

  return (
    <Box>
      <BusyListItem
        label={place.name}
        l={<PlaceButton kind="stored" onPlace={onPlace} />}
        r={<ListItemMenu onShow={place.smartId ? onShow : undefined} showDeleteDialog={() => { setShowD(true); }} showUpdateDialog={() => { setShowU(true); }} />}
      />
      {showD && <DeleteSomethingDialog name={place.name} what="place" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
      {showU && <UpdateSomethingDialog name={place.name} what="place" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
    </Box>
  );
}

type MyPlacesListProps = {

  /** List of favourite places available in the storage. */
  places: StoredPlace[];
};

/**
 * Component presenting list of passed places.
 */
export default function MyPlacesList({ places }: MyPlacesListProps): JSX.Element {

  return (
    <Box>
      {places.length > 0
        ? <Stack direction="column" gap={2}>
            {places.map((p, i) => <MyPlacesListItem key={i} index={i} place={p} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_PLACES_ADDR} what="place" icon={(sx) => <Grain sx={sx} />} />
      }
    </Box>
  );
}
