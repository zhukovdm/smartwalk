import { Stack } from "@mui/material";
import { StoredRoute } from "../../domain/types";
import { toggleViewerRouteFilter } from "../../features/viewerSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { useResultRoute } from "../../features/resultHooks";
import TraversableHeader from "../result/TraversableHeader";
import TraversableDistance from "../result/TraversableDistance";
import RouteCategoryFilters from "../result/RouteCategoryFilters";
import RouteContentList from "../result/RouteContentList";

type ViewerRouteContentProps = {
  route: StoredRoute;
  filterList: boolean[];
};

export default function ViewerRouteContent(
  { route, filterList }: ViewerRouteContentProps): JSX.Element {

  const dispatch = useAppDispatch();

  const {
    categories,
    name,
    path
  } = route;

  const {
    map,
    source,
    target,
    places
  } = useResultRoute(route, filterList);

  return (
    <Stack gap={2.5}>
      <TraversableHeader name={name} />
      <TraversableDistance distance={path.distance} />
      <RouteCategoryFilters
        categories={categories}
        filterList={filterList}
        onToggle={(index: number) => {
          dispatch(toggleViewerRouteFilter(index));
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
