import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared/menus";
import LoadStub from "./result/LoadStub";
import ResultDirecsContent from "./result/ResultDirecsContent";

export default function ResultDirecsPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { storage } = useContext(AppContext);
  const { placesLoaded } = useAppSelector((state) => state.favourites);
  const { back, result } = useAppSelector((state) => state.resultDirecs);

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
      <BackCloseMenu onBack={back ? () => { navigate(back); } : undefined} />
      <Box sx={{ mx: 2, my: 4 }}>
        {placesLoaded
          ? <Box>
              {result
                ? <ResultDirecsContent result={result} />
                : <Alert>
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
