import { useContext, useEffect, useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import { AppContext } from "../../App";
import { PlacesResult } from "../../domain/types";
import { getSatCategories } from "../../domain/functions";
import { updateResultPlacesFilter } from "../../features/resultPlacesSlice";
import {
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { SteadyPlaceListItem } from "../shared/_list-items";
import PlacesList from "./PlacesList";
import PlacesFilter from "./PlacesFilter";

type ResultPlacesContentProps = {

  /** Result object to be presented. */
  result: PlacesResult;
};

/**
 * Component presenting a result of searching places within a given circle.
 */
export default function ResultPlacesContent(
  { result }: ResultPlacesContentProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  const { filters: filterList } = useAppSelector(state => state.resultPlaces);

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
    .map((place, i) => ({
      ...structuredClone(place), /* ! */
      categories: resultPlaces[i].categories
    }))
    .filter((place) => (place.categories.some((c: number) => filterList[c])));

  const satCategories = useMemo(() => getSatCategories(resultPlaces), [resultPlaces]);

  useEffect(() => {
    map?.clear();
    places.forEach((place) => {
      (storedSmarts.has(place.smartId!))
        ? map?.addStored(place, categories)
        : map?.addCommon(place, categories, false);
    });
    map?.addCenter(center, [], false);
    map?.drawCircle(center.location, radius * 1000.0);
  }, [map, center, radius, places, storedSmarts, categories]);

  return (
    <Stack direction={"column"} gap={2.7}>
      <Stack direction={"column"} gap={2}>
        <Typography fontSize={"1.2rem"}>
          Found <strong>{resultPlaces.length}</strong> places at a distance
          at most <strong>{radius}</strong>&nbsp;km around the center point:
        </Typography>
        <SteadyPlaceListItem
          kind={center.placeId ? "stored" : "custom"}
          label={center.name}
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
              <PlacesFilter
                key={i}
                active={active}
                category={c}
                disabled={false}
                found={satCategories.has(i)}
                onToggle={() => {
                  dispatch(updateResultPlacesFilter({ filter: !active, index: i }));
                }}
              />
            );
          })}
      </Stack>
      }
      <PlacesList places={places} smarts={storedSmarts} />
    </Stack>
  );
}
