import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import { Path, UiPlace } from "../domain/types";
import { IMap } from "../domain/interfaces";

export function useResultDirecsMap(places: UiPlace[], path: Path): IMap | undefined {

  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    places.forEach((place) => {
      (!!place.placeId)
        ? map?.addStored(place, [])
        : map?.addCommon(place, [], false);
    });
    map?.drawPolyline(path.polyline);
  }, [map, path, places]);

  return map;
}
