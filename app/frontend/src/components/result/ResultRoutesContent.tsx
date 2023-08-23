import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Pagination,
  Stack,
  Typography
} from "@mui/material";
import { UiRoute } from "../../domain/types";
import {
  toggleResultRoutesFilter,
  setResultRoutesIndex
} from "../../features/resultRoutesSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { useResultRoute } from "../../features/resultHooks";
import SaveRouteDialog from "./SaveRouteDialog";
import TraversableDistance from "./TraversableDistance";
import RouteCategoryFilters from "./RouteCategoryFilters";
import RouteContentList from "./RouteContentList";

type ResultRoutesContentProps = {

  /** **Non-empty** list of routes.*/
  result: UiRoute[];
};

/**
 * Component presenting the content of a route search result.
 */
export default function ResultRoutesContent(
  { result }: ResultRoutesContentProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { index } = useAppSelector((state) => state.resultRoutes);
  const {
    resultFilters: filterList
  } = useAppSelector((state) => state.resultRoutes);

  const [saveDialog, setSaveDialog] = useState(false);

  const {
    routeId,
    distance,
    categories,
    name,
    path
  } = result[index];

  const {
    map,
    source,
    target,
    places
  } = useResultRoute(result[index], filterList);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultRoutesIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Typography fontSize={"1.1rem"}>
        Found a total of <strong>{result.length}</strong> route{result.length > 1 ? "s" : ""} with a distance of at most <strong>{distance}</strong>&nbsp;km. Each of them visits at least one place from <strong>{categories.length}</strong> categories.
      </Typography>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={index + 1}
          count={result.length}
          onChange={onPage}
        />
      </Box>
      {(routeId)
        ? <Alert severity={"success"}>
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Box>
            <Alert
              icon={false}
              severity={"info"}
              action={
                <Button
                  color={"inherit"}
                  size={"small"}
                  onClick={() => { setSaveDialog(true); }}
                >
                  <span>Save</span>
                </Button>
              }
            >
              Would you like to save this route?
            </Alert>
            {saveDialog && <SaveRouteDialog route={result[index]} index={index} onHide={() => { setSaveDialog(false); }} />}
          </Box>
      }
      <TraversableDistance distance={path.distance} />
      <RouteCategoryFilters
        categories={categories}
        filterList={filterList}
        onToggle={(index: number) => {
          dispatch(toggleResultRoutesFilter(index));
        }}
      />
      <RouteContentList
        map={map}
        source={source}
        target={target}
        places={places}
        filterList={filterList}
      />
    </Stack>
  );
}
