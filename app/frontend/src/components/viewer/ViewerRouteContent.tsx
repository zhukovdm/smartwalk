import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { StoredRoute } from "../../domain/types";
import { toggleViewerRouteFilter } from "../../features/viewerSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { useResultRoute } from "../../features/resultHooks";
import TraversableHeader from "../shared/TraversableHeader";
import TraversableDistance from "../shared/TraversableDistance";
import RouteCategoryFilters from "../shared/RouteCategoryFilters";
import RouteContentList from "../shared/RouteContentList";

type ViewerRouteContentProps = {

  /** Route to show */
  route: StoredRoute;

  /** List of (in-)active categories */
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

  // eslint-disable-next-line
  useEffect(() => { map?.flyTo(source); }, []);

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
