import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import RouteIcon from "@mui/icons-material/Route";
import { SEARCH_ROUTES_ADDR } from "../../utils/routing";
import {
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useAppSelector } from "../../features/storeHooks";
import FavoriteStub from "./FavoriteStub";
import MyRoutesListItem from "./MyRoutesListItem";

export type MyRoutesListProps = {

  /** Id of a label provider */
  "aria-labelledby": string;
};

/**
 * Component presenting the list of stored routes.
 */
export default function MyRoutesList(props: MyRoutesListProps): JSX.Element {

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();

  const { routes } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      {routes.length > 0
        ? <Stack
            {...props}
            direction={"column"}
            gap={2}
            role={"list"}
            sx={{ mb: 2 }}
          >
            {routes.map((r, i) => (
              <MyRoutesListItem
                key={i}
                index={i}
                route={r}
                storedPlaces={storedPlaces}
                storedSmarts={storedSmarts}
              />
            ))}
          </Stack>
        : <FavoriteStub
            what={"route"}
            link={SEARCH_ROUTES_ADDR}
            icon={
              (sx) => (<RouteIcon className={"stored-share"} sx={sx} />)
            }
          />
      }
    </Box>
  )
}
