import { useContext, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import { PlacesResult } from "../../domain/types";
import { getSatCategories } from "../../domain/functions";
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
import { FixedPlaceListItem } from "../_shared/_list-items";
import PlacesList from "../_shared/PlacesList";
import CategoryFilter from "../_shared/CategoryFilter";

type ResultPlacesContentProps = {

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

  const center = usePlace(resultCenter, storedPlaces, new Map())!;

  const places = usePlaces(resultPlaces, new Map(), storedSmarts)
    .filter((place) => (
      categories.length === 0 || place.categories.some((c: number) => filterList[c])));

  const satCategories = useMemo(() => getSatCategories(resultPlaces), [resultPlaces]);

  useEffect(() => {
    map?.clear();

    places.forEach((place) => {
      (!!place.placeId)
        ? map?.addStored(place, categories)
        : map?.addCommon(place, categories, false);
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
        <Typography fontSize={"1.10rem"}>
          Found a total of <strong>{resultPlaces.length}</strong> place{resultPlaces.length > 1 ? "s" : ""} within a distance of at most <strong>{radius}</strong>&nbsp;km around the center point:
        </Typography>
        <FixedPlaceListItem
          kind={"center"}
          label={center.name}
          smartId={center.smartId}
          title={"Fly to"}
          onPlace={() => { map?.flyTo(center); }}
        />
      </Stack>
      {categories.length > 0 &&
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"center"}
          spacing={2}
        >
          {categories.map((c, i) => {
            const active = filterList[i];
            return (
              <CategoryFilter
                key={i}
                active={active}
                index={i}
                category={c}
                found={satCategories.has(i)}
                onToggle={() => {
                  dispatch(setResultPlacesPage(0));
                  dispatch(toggleResultPlacesFilter(i));
                }}
              />
            );
          })}
        </Stack>
      }
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={page + 1}
          count={getPageCount(places.length, pageSize)}
          onChange={onPage}
        />
      </Box>
      <PlacesList
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
          aria-label={"Rows per page"}
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
