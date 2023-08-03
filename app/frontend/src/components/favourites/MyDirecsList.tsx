import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
} from "@mui/material";
import { Directions } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredDirec, StoredPlace } from "../../domain/types";
import {
  FAVOURITES_ADDR,
  RESULT_DIRECS_ADDR,
  SEARCH_DIRECS_ADDR
} from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  deleteFavouriteDirec,
  updateFavouriteDirec
} from "../../features/favouritesSlice";
import {
  setResultDirecs,
  setResultDirecsBack
} from "../../features/resultDirecsSlice";
import { DirecButton } from "../shared/buttons";
import { BusyListItem } from "../shared/list-items";
import ListItemMenu from "./ListItemMenu";
import FavouriteStub from "./FavouriteStub";
import UpdateSomethingDialog from "./UpdateSomethingDialog";
import DeleteSomethingDialog from "./DeleteSomethingDialog";

type MyDirecsListItemProps = {

  /** Index of a direction in the list. */
  index: number;

  /** Direction under consideration. */
  direc: StoredDirec;

  /** Ids of all stored places. */
  knowns: Map<string, StoredPlace>;
};

function MyDirecsListItem({ index, direc, knowns }: MyDirecsListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { map, storage } = useContext(AppContext);
  const { name, path, sequence } = direc;

  const [showU, setShowU] = useState(false);
  const [showD, setShowD] = useState(false);

  const onDirec = () => {
    map?.clear();
    sequence.forEach((place) => {
      !!place.placeId && !!knowns.has(place.placeId)
        ? map?.addStored(knowns.get(place.placeId)!)
        : map?.addCustom(place, false);
    });
    map?.drawPolyline(path.polyline);

    const fst = sequence[0];
    map?.flyTo(!!fst.placeId ? (knowns.get(fst.placeId) ?? fst) : fst);
  };

  const onShow = () => {
    dispatch(setResultDirecs(direc));
    dispatch(setResultDirecsBack(FAVOURITES_ADDR));
    navigate(RESULT_DIRECS_ADDR);
  };

  const onUpdate = async (name: string): Promise<void> => {
    const dr = { ...direc, name: name };
    await storage.updateDirec(dr);
    dispatch(updateFavouriteDirec({ direc: dr, index: index }));
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteDirec(direc.direcId);
    dispatch(deleteFavouriteDirec(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<DirecButton onDirec={onDirec} />}
        r={<ListItemMenu onShow={onShow} showUpdateDialog={() => { setShowU(true); }} showDeleteDialog={() => { setShowD(true); }} />}
      />
      {showU && <UpdateSomethingDialog name={name} what="direction" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
      {showD && <DeleteSomethingDialog name={name} what="direction" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
    </Box>
  );
}

type MyDirecsListProps = {

  /** List of stored directions. */
  direcs: StoredDirec[];
};

/**
 * Component presenting passed list of stored directions.
 */
export default function MyDirecsList({ direcs }: MyDirecsListProps): JSX.Element {

  const { places } = useAppSelector(state => state.favourites);

  const knowns = useMemo(() => (
    places.reduce((map, place) => map.set(place.placeId, place), new Map<string, StoredPlace>())
  ), [places]);

  return (
    <Box>
      {direcs.length > 0
        ? <Stack direction="column" gap={2} sx={{ mb: 2 }}>
            {direcs.map((d, i) => <MyDirecsListItem key={i} index={i} direc={d} knowns={knowns} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_DIRECS_ADDR} what="direction" icon={(sx) => <Directions sx={sx} />} />
      }
    </Box>
  );
}
