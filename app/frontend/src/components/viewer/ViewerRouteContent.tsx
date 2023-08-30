import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { StoredRoute } from "../../domain/types";
import { toggleViewerRouteFilter } from "../../features/viewerSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { useResultRoute } from "../../features/resultHooks";
import CategoryFilterList from "../_shared/CategoryFilterList";
import RouteContentList from "../_shared/RouteContentList";
import TraversableHeader from "../_shared/TraversableHeader";
import TraversableDistance from "../_shared/TraversableDistance";

type ViewerRouteContentProps = {

  /** Route to show */
  route: StoredRoute;

  /** List of (in-)active categories */
  filterList: boolean[];
};

/**
 * View of a stored route.
 */
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
      <CategoryFilterList
        categories={categories}
        filterList={filterList}
        found={(_: number) => true}
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
