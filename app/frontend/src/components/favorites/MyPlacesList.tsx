import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PlaceIcon from "@mui/icons-material/Place";
import { SEARCH_PLACES_ADDR } from "../../utils/routing";
import { useAppSelector } from "../../features/storeHooks";
import FavoriteStub from "./FavoriteStub";
import MyPlacesListItem from "./MyPlacesListItem";

export type MyPlacesListProps = {

  /** Id of a label provider */
  "aria-labelledby": string;
}

/**
 * Component presenting list of passed places.
 */
export default function MyPlacesList(props: MyPlacesListProps): JSX.Element {

  const { places } = useAppSelector((state) => state.favorites);

  return (
    <Box sx={{ mb: 2 }}>
      {places.length > 0
        ? <Stack
            {...props}
            direction={"column"}
            gap={2}
            role={"list"}
          >
            {places.map((p, i) => (
              <MyPlacesListItem key={i} index={i} place={p} />
            ))}
          </Stack>
        : <FavoriteStub
            what={"place"}
            link={SEARCH_PLACES_ADDR}
            icon={
              (sx) => (<PlaceIcon className={"stored-share"} sx={sx} />)
            }
          />
      }
    </Box>
  );
}
