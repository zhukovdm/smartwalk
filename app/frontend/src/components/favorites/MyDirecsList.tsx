import { useContext, useMemo, useState } from "react";
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
import { setViewerDirec } from "../../features/viewerSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { DirecButton } from "../shared/_buttons";
import { BusyListItem } from "../shared/_list-items";
import ListItemMenu from "./ListItemMenu";
import FavoriteStub from "./FavoriteStub";
import UpdateSomethingDialog from "./UpdateSomethingDialog";
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

  const [showU, setShowU] = useState(false);
  const [showD, setShowD] = useState(false);

  const onDirec = () => {
    map?.clear();
    waypoints.forEach((place) => {
      !!place.placeId && !!storedPlaces.has(place.placeId)
        ? map?.addStored(storedPlaces.get(place.placeId)!, [])
        : map?.addCommon(place, [], false);
    });
    map?.drawPolyline(path.polyline);

    const fst = waypoints[0];
    map?.flyTo(!!fst.placeId ? (storedPlaces.get(fst.placeId) ?? fst) : fst);
  };

  const onShow = () => {
    dispatch(setViewerDirec(direc));
    navigate(VIEWER_DIREC_ADDR);
  };

  const onUpdate = async (name: string): Promise<void> => {
    const d = { ...direc, name: name };
    await storage.updateDirec(d);
    dispatch(updateFavoriteDirec({ direc: d, index: index }));
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteDirec(direc.direcId);
    dispatch(deleteFavoriteDirec(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<DirecButton onDirec={onDirec} />}
        r={
          <ListItemMenu
            onShow={onShow}
            showDeleteDialog={() => { setShowD(true); }}
            showUpdateDialog={() => { setShowU(true); }}
          />
        }
      />
      <DeleteSomethingDialog
        show={showD}
        name={name}
        what={"direction"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
      <UpdateSomethingDialog
        show={showU}
        name={name}
        what={"direction"}
        onHide={() => { setShowU(false); }}
        onUpdate={onUpdate}
      />
    </Box>
  );
}

type MyDirecsListProps = {

  /** List of all stored directions. */
  direcs: StoredDirec[];

  /** * List of all stored places. */
  places: StoredPlace[];
};

/**
 * Component presenting passed list of stored directions.
 */
export default function MyDirecsList({ direcs, places }: MyDirecsListProps): JSX.Element {

  const storedPlaces = useMemo(() => (
    places.reduce((acc, place) => acc.set(place.placeId, place), new Map<string, StoredPlace>())
  ), [places]);

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
