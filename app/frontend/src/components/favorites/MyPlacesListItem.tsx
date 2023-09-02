import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { AppContext } from "../../App";
import { VIEWER_PLACE_ADDR } from "../../domain/routing";
import { StoredPlace } from "../../domain/types";
import { getSmartPlaceLink } from "../../utils/functions";
import {
  updateFavoritePlace,
  deleteFavoritePlace
} from "../../features/favoritesSlice";
import {
  appendSearchDirecsPlace
} from "../../features/searchDirecsSlice";
import { setViewerPlace } from "../../features/viewerSlice";
import { useAppDispatch } from "../../features/storeHooks";
import PlaceButton from "../_shared/PlaceButton";
import StandardListItem from "../_shared/StandardListItem";
import PlaceAppendDialog from "../_shared/PlaceAppendDialog";
import DeleteSomethingDialog from "./SomethingDeleteDialog";
import SomethingEditDialog from "./SomethingEditDialog";
import ListItemMenu from "./ListItemMenu";

export type MyPlacesListItemProps = {

  /** The position of the place in the list. */
  index: number;

  /** Place object. */
  place: StoredPlace;
};

/**
 * List item with place icon, label, and menu.
 */
export default function MyPlacesListItem({ index, place }: MyPlacesListItemProps): JSX.Element {

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
    <Box
      role={"listitem"}
      aria-label={place.name}
    >
      <StandardListItem
        label={place.name}
        link={getSmartPlaceLink(place.smartId)}
        l={
          <PlaceButton
            kind={"stored"}
            onClick={onPlace}
            title={"Draw place"}
          />
        }
        r={
          <ListItemMenu
            what={"place"}
            index={index}
            onShow={onShow}
            showEditDialog={() => { setShowE(true); }}
            showAppendDialog={() => { setShowA(true); }}
            showDeleteDialog={() => { setShowD(true); }}
          />
        }
      />
      <SomethingEditDialog
        show={showE}
        name={place.name}
        what={"place"}
        onHide={() => { setShowE(false); }}
        onSave={onSave}
      />
      <PlaceAppendDialog
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