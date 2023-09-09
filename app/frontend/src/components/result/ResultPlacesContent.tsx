import { useContext, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import { PlacesResult } from "../../domain/types";
import { getSatCategories } from "../../utils/functions";
import {
  setResultPlacesPage,
  setResultPlacesPageSize,
  toggleResultPlacesFilter
} from "../../features/resultPlacesSlice";
import {
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import CategoryFilterList from "../_shared/CategoryFilterList";
import InformPlaceListItem from "../_shared/InformPlaceListItem";
import PlacesFoundList from "./PlacesFoundList";

export type ResultPlacesContentProps = {

  /** Result object to be presented. */
  result: PlacesResult;
};

function getPageCount(itemCount: number, pageSize: number): number {
  const whole = Math.floor(itemCount / pageSize);
  return Math.max(1, whole + ((whole * pageSize < itemCount) ? 1 : 0));
}

/**
 * Component presenting a result of searching places within a given circle.
 */
export default function ResultPlacesContent(
  { result }: ResultPlacesContentProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  const { page, pageSize } = useAppSelector((state) => state.resultPlaces);
  const { filters: filterList } = useAppSelector((state) => state.resultPlaces);

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();
  const {
    center: resultCenter,
    radius,
    places: resultPlaces,
    categories
  } = result;

  const center = usePlace(resultCenter, storedPlaces, storedSmarts)!;

  const places = usePlaces(resultPlaces, storedPlaces, storedSmarts)
    .filter(([p, _]) => (
      categories.length === 0 || p.categories.some((c: number) => filterList[c])));

  const satCategories = useMemo(() => getSatCategories(resultPlaces), [resultPlaces]);

  useEffect(() => {
    map?.clear();

    places.forEach(([p, s]) => {
      (s)
        ? map?.addStored(p, categories)
        : map?.addCommon(p, categories, false);
    });

    map?.addCenter(center, [], false);
    map?.drawCircle(center.location, radius * 1000.0);
  }, [map, center, radius, places, categories]);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultPlacesPage(value - 1));
  }

  const onRows = (event: SelectChangeEvent) => {
    dispatch(setResultPlacesPageSize(parseInt(event.target.value)));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Stack direction={"column"} gap={2}>
        <Typography>
          Found a total of <strong>{resultPlaces.length}</strong> place{resultPlaces.length > 1 ? "s" : ""} within a distance of at most <strong>{radius}</strong>&nbsp;km around the center point:
        </Typography>
        <Box
          role={"region"}
          aria-label={"Center point"}
        >
          <InformPlaceListItem
            kind={"center"}
            place={center}
            title={"Fly to"}
            onPlace={() => { map?.flyTo(center); }}
          />
        </Box>
        {categories.length > 0 &&
          <CategoryFilterList
            categories={categories}
            filterList={filterList}
            found={(index: number) => satCategories.has(index)}
            onToggle={(index: number) => {
              dispatch(toggleResultPlacesFilter(index));
            }}
          />
        }
      </Stack>
      <Box
        display={"flex"}
        justifyContent={"center"}
      >
        <Pagination
          page={page + 1}
          count={getPageCount(places.length, pageSize)}
          onChange={onPage}
        />
      </Box>
      <PlacesFoundList
        map={map}
        places={places.slice(page * pageSize, page * pageSize + pageSize)}
      />
      <Box
        alignItems={"center"}
        display={"flex"}
        gap={2}
        justifyContent={"right"}
      >
        <Typography>Rows per page:</Typography>
        <Select
          role={"navigation"}
          aria-label={"rows per page"}
          onChange={onRows}
          size={"small"}
          value={pageSize.toString()}
        >
          {[5, 10, 20, 50].map((ps, i) => (
            <MenuItem
              key={i}
              value={ps.toString()}>
              {ps}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Stack>
  );
}
