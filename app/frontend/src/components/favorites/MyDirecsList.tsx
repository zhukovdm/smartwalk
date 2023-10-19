import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DirectionsIcon from "@mui/icons-material/Directions";
import { SEARCH_DIRECS_ADDR } from "../../utils/routing";
import {
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useAppSelector } from "../../features/storeHooks";
import FavoriteStub from "./FavoriteStub";
import MyDirecsListItem from "./MyDirecsListItem";

export type MyDirecsListProps = {

  /** Id of a label provider */
  "aria-labelledby": string;
}

/**
 * Component presenting the list of stored directions.
 */
export default function MyDirecsList(props: MyDirecsListProps): JSX.Element {

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();
  const { direcs } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      {direcs.length > 0
        ? <Stack
            {...props}
            direction={"column"}
            gap={2}
            role={"list"}
            sx={{ mb: 2 }}
          >
            {direcs.map((d, i) => (
              <MyDirecsListItem
                key={i}
                index={i}
                direc={d}
                storedPlaces={storedPlaces}
                storedSmarts={storedSmarts}
              />
            ))}
          </Stack>
        : <FavoriteStub
            what={"direction"}
            link={SEARCH_DIRECS_ADDR}
            icon={
              (sx) => (<DirectionsIcon className={"stored-share"} sx={sx} />)
            }
          />
      }
    </Box>
  );
}
