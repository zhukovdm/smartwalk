import { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { UiRoute } from "../../domain/types";
import { IdGenerator } from "../../utils/helpers";
import { createFavoriteRoute } from "../../features/favoritesSlice";
import { setBlock } from "../../features/panelSlice";
import { updateResultRoute } from "../../features/resultRoutesSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";

type SaveRouteDialogProps = {

  /** Route to be saved. */
  route: UiRoute;

  /** Position of the route in the list. */
  index: number;

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Dialog for saving a route appeared in the result.
 */
export default function SaveRouteDialog(
  { route, index, onHide }: SaveRouteDialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { block } = useAppSelector(state => state.panel);

  const [name, setName] = useState(route.name);

  const saveAction = async (): Promise<void> => {
    dispatch(setBlock(true));
    try {
      const rt = { ...route, name: name };
      const sr = {
        ...rt,
        routeId: IdGenerator.generateId(rt)
      };
      await storage.createRoute(sr);
      dispatch(createFavoriteRoute(sr));
      dispatch(updateResultRoute({ route: sr, index: index }));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save route</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <TextField
            value={name}
            sx={{ mt: 0.5 }}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth={"350px"}>
            <Typography fontSize={"small"} color={"grey"}>
              Save operation creates a <strong>local copy</strong> of this
              route. Those are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Button
              color={"error"}
              disabled={block}
              onClick={onHide}
            >
              <span>Discard</span>
            </Button>
            <Button
              disabled={block || !(name.trim().length > 0)}
              onClick={() => { saveAction(); }}
            >
              <span>Save</span>
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
