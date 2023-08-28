import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useSmartPlace } from "../features/entityHooks";
import { useAppSelector } from "../features/storeHooks";
import BackCloseBar from "./_shared/BackCloseBar";
import LoadingStub from "./_shared/LoadingStub";
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
      <BackCloseBar />
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
          : <LoadingStub />
        }
      </Box>
    </Box>
  );
}
