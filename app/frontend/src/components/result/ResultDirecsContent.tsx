import { useContext, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import { UiDirec } from "../../domain/types";
import {
  setResultDirecsIndex,
  updateResultDirec
} from "../../features/resultDirecsSlice";
import { createFavoriteDirec } from "../../features/favoritesSlice";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import { IdGenerator } from "../../utils/helpers";
import DirecContentList from "../_shared/DirecContentList";
import TraversableDistance from "../_shared/TraversableDistance";
import SomethingActionMenu from "../_shared/SomethingActionMenu";
import SomethingSaveDialog from "../_shared/SomethingSaveDialog";

type ResultDirecsContentProps = {

  /** **Non-empty** list of directions. */
  result: UiDirec[];
};

/**
 * Component presenting the content of a direction search result.
 */
export default function ResultDirecsContent(
  { result }: ResultDirecsContentProps): JSX.Element {

  const { storage } = useContext(AppContext);
  
  const dispatch = useAppDispatch();
  const { index } = useAppSelector((state) => state.resultDirecs);

  const [showS, setShowS] = useState(false);

  const direc = result[index];

  const {
    direcId,
    name,
    path,
    waypoints
  } = direc;

  const places = usePlaces(waypoints, useStoredPlaces(), useStoredSmarts());

  const map = useResultDirecsMap(places, path);

  const onSave = async (name: string) => {
    const d = { ...direc, name: name };
    const s = {
      ...d,
      direcId: IdGenerator.generateId(d)
    };
    await storage.createDirec(s);
    dispatch(createFavoriteDirec(s));
    dispatch(updateResultDirec({ direc: s, index: index }));
  };

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultDirecsIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Typography fontSize={"1.1rem"}>
        Found a total of <strong>{result.length}</strong> direction{result.length > 1 ? "s" : ""}.
      </Typography>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={index + 1}
          count={result.length}
          onChange={onPage}
        />
      </Box>
      {(!!direcId)
        ? <Alert
            icon={false}
            severity={"success"}
            action={<SomethingActionMenu />}
          >
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Alert
            icon={false}
            severity={"info"}
            action={
              <SomethingActionMenu
                showSaveDialog={() => { setShowS(true); }}
              />
            }
          >
            This direction is not in your Favorites yet.
          </Alert>
      }
      <SomethingSaveDialog
        name={name}
        show={showS}
        what={"direction"}
        onHide={() => { setShowS(false); }}
        onSave={onSave}
      />
      <TraversableDistance distance={path.distance} />
      <DirecContentList
        map={map}
        places={places}
      />
    </Stack>
  );
}
