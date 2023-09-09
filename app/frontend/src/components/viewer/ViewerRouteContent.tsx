import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { StoredRoute } from "../../domain/types";
import { toggleViewerRouteFilter } from "../../features/viewerSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { useResultRoute } from "../../features/resultHooks";
import ArrowsLinkButton from "../_shared/ArrowsLinkButton";
import CategoryFilterList from "../_shared/CategoryFilterList";
import PrecedenceViewDialog from "../_shared/PrecedenceViewDialog";
import RouteContentList from "../_shared/RouteContentList";
import TraversableHeader from "../_shared/TraversableHeader";

export type ViewerRouteContentProps = {

  /** Route to show */
  route: StoredRoute;
};

/**
 * View of a stored route.
 */
export default function ViewerRouteContent(
  { route }: ViewerRouteContentProps): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    routeFilters: filterList
  } = useAppSelector((state) => state.viewer);

  const {
    categories,
    precedence,
    name,
    path
  } = route;

  const {
    map,
    source,
    target,
    waypoints
  } = useResultRoute(route, filterList);

  // eslint-disable-next-line
  useEffect(() => { map?.flyTo(source); }, []);

  const [showPrecedence, setShowPrecedence] = useState(false);

  return (
    <Stack gap={2.5}>
      <TraversableHeader name={name} />
      <Stack gap={1}>
        <Typography>
          This route is <strong>{parseFloat(path.distance.toFixed(2))}</strong>&nbsp;km long and visits at least one place from each of the <strong>{categories.length}</strong> categor{categories.length > 1 ? "ies" : "y"} (arranged by the set of <ArrowsLinkButton onClick={() => { setShowPrecedence(true); }} />):
        </Typography>
        <CategoryFilterList
          categories={categories}
          filterList={filterList}
          found={(_: number) => true}
          onToggle={(index: number) => {
            dispatch(toggleViewerRouteFilter(index));
          }}
        />
        <PrecedenceViewDialog
          show={showPrecedence}
          categories={categories}
          precedence={precedence}
          onHide={() => { setShowPrecedence(false); }}
        />
      </Stack>
      <RouteContentList
        map={map}
        source={source}
        target={target}
        waypoints={waypoints}
        filterList={filterList}
      />
    </Stack>
  );
}
