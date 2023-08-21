import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Place } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace } from "../../domain/types";
import {
  SEARCH_PLACES_ADDR,
  VIEWER_PLACE_ADDR
} from "../../domain/routing";
import {
  updateFavoritePlace,
  deleteFavoritePlace
} from "../../features/favoritesSlice";
import { setViewerPlace } from "../../features/viewerSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { PlaceButton } from "../shared/_buttons";
import { BusyListItem } from "../shared/_list-items";
import DeleteSomethingDialog from "./DeleteSomethingDialog";
import EditSomethingDialog from "./EditSomethingDialog";
import ListItemMenu from "./ListItemMenu";
import FavoriteStub from "./FavoriteStub";

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
    map?.addStored(place, []);
    map?.flyTo(place);
  };

  const onShow = () => {
    dispatch(setViewerPlace(place));
    navigate(VIEWER_PLACE_ADDR);
  };

  const onUpdate = async (name: string): Promise<void> => {
    const pl = { ...place, name: name };
    await storage.updatePlace(pl);
    dispatch(updateFavoritePlace({ place: pl, index: index }));
  };

  const onDelete = async (): Promise<void> => {
    await storage.deletePlace(place.placeId);
    dispatch(deleteFavoritePlace(index));
  };

  return (
    <Box>
      <BusyListItem
        label={place.name}
        l={
          <PlaceButton
            kind={"stored"}
            onPlace={onPlace}
          />
        }
        r={
          <ListItemMenu
            onShow={onShow}
            showDeleteDialog={() => { setShowD(true); }}
            showEditDialog={() => { setShowU(true); }}
          />
        }
      />
      <DeleteSomethingDialog
        show={showD}
        name={place.name}
        what={"place"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
      <EditSomethingDialog
        show={showU}
        name={place.name}
        what={"place"}
        onHide={() => { setShowU(false); }}
        onSave={onUpdate}
      />
    </Box>
  );
}

type MyPlacesListProps = {

  /** List of favorite places available in the storage. */
  places: StoredPlace[];
};

/**
 * Component presenting list of passed places.
 */
export default function MyPlacesList({ places }: MyPlacesListProps): JSX.Element {

  return (
    <Box>
      {places.length > 0
        ? <Stack direction={"column"} gap={2}>
            {places.map((p, i) => <MyPlacesListItem key={i} index={i} place={p} />)}
          </Stack>
        : <FavoriteStub
            what={"place"}
            link={SEARCH_PLACES_ADDR}
            icon={(sx) => <Place sx={sx} />}
          />
      }
    </Box>
  );
}
