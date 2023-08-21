import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Directions } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredDirec, StoredPlace } from "../../domain/types";
import {
  SEARCH_DIRECS_ADDR,
  VIEWER_DIREC_ADDR
} from "../../domain/routing";
import {
  deleteFavoriteDirec,
  updateFavoriteDirec
} from "../../features/favoritesSlice";
import {
  appendSearchDirecsPlace,
  resetSearchDirecs
} from "../../features/searchDirecsSlice";
import { setViewerDirec } from "../../features/viewerSlice";
import { usePlaces, useStoredPlaces } from "../../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { DirecButton } from "../shared/_buttons";
import { BusyListItem } from "../shared/_list-items";
import ModifySomethingDialog from "../shared/ModifySomethingDialog";
import ListItemMenu from "./ListItemMenu";
import FavoriteStub from "./FavoriteStub";
import EditSomethingDialog from "./EditSomethingDialog";
import DeleteSomethingDialog from "./DeleteSomethingDialog";

type MyDirecsListItemProps = {

  /** Index of a direction in the list. */
  index: number;

  /** Direction in consideration. */
  direc: StoredDirec;

  /** All stored `places` (to draw pins). */
  storedPlaces: Map<string, StoredPlace>;
};

function MyDirecsListItem({ index, direc, storedPlaces }: MyDirecsListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const { name, path, waypoints } = direc;
  const places = usePlaces(waypoints, storedPlaces, new Map());

  const [showD, setShowD] = useState(false);
  const [showE, setShowE] = useState(false);
  const [showM, setShowM] = useState(false);

  const onDirec = () => {
    map?.clear();
    places.forEach((place) => {
      (!!place.placeId)
        ? map?.addStored(place, [])
        : map?.addCommon(place, [], false);
    });
    map?.drawPolyline(path.polyline);
    map?.flyTo(places[0]);
  };

  const onShow = () => {
    dispatch(setViewerDirec(direc));
    navigate(VIEWER_DIREC_ADDR);
  };

  const onSave = async (name: string): Promise<void> => {
    const d = { ...direc, name: name };
    await storage.updateDirec(d);
    dispatch(updateFavoriteDirec({ direc: d, index: index }));
  };

  const onModify = (): void => {
    dispatch(resetSearchDirecs());
    places.forEach((place) => {
      dispatch(appendSearchDirecsPlace(place));
    });
    navigate(SEARCH_DIRECS_ADDR);
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteDirec(direc.direcId);
    dispatch(deleteFavoriteDirec(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<DirecButton title={"Draw"} onDirec={onDirec} />}
        r={
          <ListItemMenu
            onShow={onShow}
            showEditDialog={() => { setShowE(true); }}
            showDeleteDialog={() => { setShowD(true); }}
            showModifyDialog={() => { setShowM(true); }}
          />
        }
      />
      <EditSomethingDialog
        show={showE}
        name={name}
        what={"direction"}
        onHide={() => { setShowE(false); }}
        onSave={onSave}
      />
      <ModifySomethingDialog
        show={showM}
        what={"direction"}
        onHide={() => { setShowM(false); }}
        onModify={onModify}
      />
      <DeleteSomethingDialog
        show={showD}
        name={name}
        what={"direction"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
    </Box>
  );
}

/**
 * Component presenting passed list of stored directions.
 */
export default function MyDirecsList(): JSX.Element {

  const storedPlaces = useStoredPlaces();
  const { direcs } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      {direcs.length > 0
        ? <Stack direction={"column"} gap={2} sx={{ mb: 2 }}>
            {direcs.map((d, i) => <MyDirecsListItem key={i} index={i} direc={d} storedPlaces={storedPlaces} />)}
          </Stack>
        : <FavoriteStub
            what={"direction"}
            link={SEARCH_DIRECS_ADDR}
            icon={(sx) => <Directions sx={sx} />}
          />
      }
    </Box>
  );
}
