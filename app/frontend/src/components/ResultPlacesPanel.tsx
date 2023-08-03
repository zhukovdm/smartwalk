import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../App";
import { SEARCH_PLACES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared/menus";
import LoadStub from "./result/LoadStub";
import ResultPlacesContent from "./result/ResultPlacesContent";

export default function ResultPlacesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { result } = useAppSelector((state) => state.resultPlaces);
  const { placesLoaded } = useAppSelector((state) => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        dispatch(setFavouritePlaces(await storage.getAllPlaces()));
        dispatch(setFavouritePlacesLoaded());
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  return (
    <Box>
      <BackCloseMenu onBack={() => { navigate(SEARCH_PLACES_ADDR); }} />
      <Box sx={{ mx: 2, my: 4 }}>
        {placesLoaded
          ? <Box>
              {result && result.places.length > 0
                ? <ResultPlacesContent result={result} />
                : <Alert severity="warning">
                    Result appears to be empty. Try different search parameters.
                  </Alert>
              }
            </Box>
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
