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
import { getSmartPlaceLink } from "../../domain/functions";
import {
  updateFavoritePlace,
  deleteFavoritePlace
} from "../../features/favoritesSlice";
import { appendSearchDirecsPlace } from "../../features/searchDirecsSlice";
import { setViewerPlace } from "../../features/viewerSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { PlaceButton } from "../shared/_buttons";
import { BusyListItem } from "../shared/_list-items";
import AppendPlaceDialog from "./AppendPlaceDialog";
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

  const [showA, setShowA] = useState(false);
  const [showD, setShowD] = useState(false);
  const [showE, setShowE] = useState(false);

  const onPlace = () => {
    map?.clear();
    map?.addStored(place, []);
    map?.flyTo(place);
  };

  const onShow = () => {
    dispatch(setViewerPlace(place));
    navigate(VIEWER_PLACE_ADDR);
  };

  const onSave = async (name: string): Promise<void> => {
    const p = { ...place, name: name };
    await storage.updatePlace(p);
    dispatch(updateFavoritePlace({ place: p, index: index }));
  };

  const onAppend = (): void => {
    dispatch(appendSearchDirecsPlace(place));
  }

  const onDelete = async (): Promise<void> => {
    await storage.deletePlace(place.placeId);
    dispatch(deleteFavoritePlace(index));
    map?.clear();
  };

  return (
    <Box>
      <BusyListItem
        label={place.name}
        link={getSmartPlaceLink(place.smartId)}
        l={
          <PlaceButton
            kind={"stored"}
            onPlace={onPlace}
            title={"Draw"}
          />
        }
        r={
          <ListItemMenu
            onShow={onShow}
            showEditDialog={() => { setShowE(true); }}
            showAppendDialog={() => { setShowA(true); }}
            showDeleteDialog={() => { setShowD(true); }}
          />
        }
      />
      <EditSomethingDialog
        show={showE}
        name={place.name}
        what={"place"}
        onHide={() => { setShowE(false); }}
        onSave={onSave}
      />
      <AppendPlaceDialog
        show={showA}
        onHide={() => { setShowA(false); }}
        onAppend={onAppend}
      />
      <DeleteSomethingDialog
        show={showD}
        name={place.name}
        what={"place"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
    </Box>
  );
}

/**
 * Component presenting list of passed places.
 */
export default function MyPlacesList(): JSX.Element {

  const { places } = useAppSelector((state) => state.favorites);

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
