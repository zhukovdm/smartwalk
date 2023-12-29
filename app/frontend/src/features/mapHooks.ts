import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function useLocate(): void {
  const map = useMap();

  useEffect(() => {
    // map.attributionControl.setPrefix(false);
    const lc = L.control.locate({ position: "bottomright" }).addTo(map);
    return () => { lc.remove(); }
  }, [map]);
}
