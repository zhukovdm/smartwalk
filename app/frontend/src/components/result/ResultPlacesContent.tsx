import { useContext, useEffect, useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import { AppContext } from "../../App";
import { PlacesResult } from "../../domain/types";
import { RESULT_PLACES_ADDR } from "../../domain/routing";
import { getCopyKnownGrains, getSatConditions } from "../../domain/functions";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setResultPlacesFilters } from "../../features/resultPlacesSlice";
import { SteadyPlaceListItem } from "../shared/list-items";
import PlacesList from "./PlacesList";
import PlacesFilter from "./PlacesFilter";

type ResultPlacesContentProps = {

  /** Result object to be presented. */
  result: PlacesResult;
};

/**
 * Component presenting a result of searching places within a given circle.
 */
export default function ResultPlacesContent({ result }: ResultPlacesContentProps): JSX.Element {

  const { center, radius, categories: conditions, places: foundPlaces } = result;

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);
  const { places: knownPlaces } = useAppSelector(state => state.favourites);
  const { filters: filterLst } = useAppSelector(state => state.resultPlaces);

  // get a set of activated filters
  const filterSet = useMemo(() => new Set(filterLst), [filterLst]);

  // create a copy of known grains found in the pile of known places
  const knownGrains = useMemo(() => getCopyKnownGrains(knownPlaces), [knownPlaces]);

  // extract conditions satisfied by the result
  const satConditions = useMemo(() => getSatConditions(foundPlaces), [foundPlaces]);

  // select places based on the activated filters
  const shownPlaces = useMemo(() => foundPlaces.filter((place) => {
    return filterSet.size === 0 || place.categories.some((keyword) => filterSet.has(keyword));
  }), [foundPlaces, filterSet]);

  // draw places based on selected filters
  useEffect(() => {
    map?.clear();
    shownPlaces.forEach((place) => {
      const grain = knownGrains.get(place.smartId);
      if (grain) { grain.categories = place.categories; } // (!) change structuredClone
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    (center.placeId) ? map?.addStored(center) : map?.addCustom(center, false);
    map?.drawCircle(center.location, radius * 1000);
  }, [map, center, radius, foundPlaces, knownGrains, shownPlaces]);

  return (
    <Stack direction="column" gap={2.7}>
      <Stack direction="column" gap={2}>
        <Typography fontSize="1.2rem">
          Found <strong>{foundPlaces.length}</strong> places at a distance at most <strong>{radius}</strong>&nbsp;km around the center point:
        </Typography>
        <SteadyPlaceListItem
          kind={center.placeId ? "stored" : "custom"}
          label={center.name}
          onPlace={() => { map?.flyTo(center); }}
        />
      </Stack>
      <Stack spacing={2} direction="row" justifyContent="center" flexWrap="wrap">
        {conditions.map((c, i) => {
          const active = filterSet.has(c.keyword);
          return (
            <PlacesFilter
              key={i}
              found={satConditions.has(c.keyword)}
              active={active}
              disabled={false}
              condition={c}
              onToggle={() => {
                const fs = (active)
                  ? filterLst.filter((f) => f !== c.keyword)
                  : [...filterLst, c.keyword];
                dispatch(setResultPlacesFilters(fs));
              }}
            />
          );
        })}
      </Stack>
      <PlacesList back={RESULT_PLACES_ADDR} places={shownPlaces} grains={knownGrains} />
    </Stack>
  );
}
