import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useSmartPlace } from "../features/entityHooks";
import { useAppSelector } from "../features/storeHooks";
import { BackCloseMenu } from "./shared/_menus";
import PlaceContent from "./entity/EntityPlaceContent";

/**
 * Panel presenting a place, with menu, and content.
 */
export default function EntityPlacePanel(): JSX.Element {

  const smartId = useParams().smartId!; // always defined!
  const { place, placeLoaded } = useSmartPlace(smartId);

  const {
    loaded: favoritesLoaded
  } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      <BackCloseMenu />
      <Box sx={{ mx: 2, my: 4 }}>
        {(favoritesLoaded && placeLoaded)
          ? <Box>
              {(!!place)
                ? <PlaceContent place={place} />
                : <Alert severity={"warning"}>
                    Either an entity does not exist, or a communication error has occurred.
                  </Alert>
              }
            </Box>
          : <Box display={"flex"} justifyContent={"center"}>
              <CircularProgress />
            </Box>
        }
      </Box>
    </Box>
  );
}
