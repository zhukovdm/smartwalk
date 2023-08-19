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
import { FixedPlaceListItem } from "../shared/_list-items";
import PlacesList from "./PlacesList";
import CategoryFilter from "./CategoryFilter";

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
      const smart = storedSmarts.get(place.smartId!);
      (!!smart)
        ? map?.addStored(smart, categories)
        : map?.addCommon(place, categories, false);
    });
    map?.addCenter(center, [], false);
    map?.drawCircle(center.location, radius * 1000.0);
  }, [map, center, radius, places, storedSmarts, categories]);

  return (
    <Stack direction={"column"} gap={2.7}>
      <Stack direction={"column"} gap={2}>
        <Typography fontSize={"1.10rem"}>
          Found a total of <strong>{resultPlaces.length}</strong> places
          within a distance of at most <strong>{radius}</strong>&nbsp;km
          around the center point:
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
