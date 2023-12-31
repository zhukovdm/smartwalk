import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  SEARCH_DIRECS_ADDR,
  VIEWER_DIREC_ADDR
} from "../../utils/routing";
import {
  StoredDirec,
  StoredPlace
} from "../../domain/types";
import { AppContext } from "../../App";
import {
  deleteFavoriteDirec,
  updateFavoriteDirec
} from "../../features/favoritesSlice";
import {
  appendSearchDirecsPlace,
  resetSearchDirecs
} from "../../features/searchDirecsSlice";
import { setViewerDirec } from "../../features/viewerSlice";
import { usePlaces } from "../../features/sharedHooks";
import { useAppDispatch } from "../../features/storeHooks";
import StandardListItem from "../_shared/StandardListItem";
import TraversalModifyDialog from "../_shared/TraversalModifyDialog";
import ListItemMenu from "./ListItemMenu";
import SomethingEditDialog from "./SomethingEditDialog";
import SomethingDeleteDialog from "./SomethingDeleteDialog";
import StoredDirecButton from "./StoredDirecButton";

export type MyDirecsListItemProps = {

  /** Index of a direction in the list. */
  index: number;

  /** Direction in consideration. */
  direc: StoredDirec;

  /** All stored `places` (to draw pins). */
  storedPlaces: Map<string, StoredPlace>;

  /** All stored `places` (to draw pins). */
  storedSmarts: Map<string, StoredPlace>;
};

/**
 * List item with direction icon, label, and menu.
 */
export default function MyDirecsListItem(
  { index, direc, storedPlaces, storedSmarts }: MyDirecsListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const {
    name,
    path,
    waypoints: direcWaypoints
  } = direc;

  const waypoints = usePlaces(direcWaypoints, storedPlaces, storedSmarts);

  const [showD, setShowD] = useState(false);
  const [showE, setShowE] = useState(false);
  const [showM, setShowM] = useState(false);

  const onDirec = () => {
    map?.clear();
    waypoints.forEach(([w, s]) => {
      (s)
        ? map?.addStored(w, [])
        : map?.addCommon(w, [], false);
    });
    map?.drawPolyline(path.polyline);
    map?.flyTo(waypoints[0][0]);
  };

  const onShow = () => {
    dispatch(setViewerDirec(direc));
    navigate(VIEWER_DIREC_ADDR);
  };

  const onEdit = async (name: string): Promise<void> => {
    const d = { ...direc, name: name };
    await storage.updateDirec(d);
    dispatch(updateFavoriteDirec({ direc: d, index: index }));
  };

  const onModify = (): void => {
    dispatch(resetSearchDirecs());
    waypoints.forEach(([w, _]) => {
      dispatch(appendSearchDirecsPlace(w));
    });
    navigate(SEARCH_DIRECS_ADDR);
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteDirec(direc.direcId);
    dispatch(deleteFavoriteDirec(index));
    map?.clear();
  };

  return (
    <Box
      role={"listitem"}
      aria-label={direc.name}
    >
      <StandardListItem
        label={name}
        l={
          <StoredDirecButton onClick={onDirec} />
        }
        r={
          <ListItemMenu
            what={"direc"}
            index={index}
            onShow={onShow}
            showEditDialog={() => { setShowE(true); }}
            showDeleteDialog={() => { setShowD(true); }}
            showModifyDialog={() => { setShowM(true); }}
          />
        }
      />
      <SomethingEditDialog
        key={name}
        show={showE}
        name={name}
        what={"direction"}
        onHide={() => { setShowE(false); }}
        onSave={onEdit}
      />
      <TraversalModifyDialog
        show={showM}
        what={"direction"}
        onHide={() => { setShowM(false); }}
        onModify={onModify}
      />
      <SomethingDeleteDialog
        show={showD}
        name={name}
        what={"direction"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
    </Box>
  );
}
