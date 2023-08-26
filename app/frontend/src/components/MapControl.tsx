import { useContext } from "react";
import { LatLng } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { AppContext } from "../App";
import { MapFactory } from "../features/context";

/**
 * Obtain Leaflet map and store it to the context.
 */
function MapExtractor(): JSX.Element {

  const map = useMap();
  const ctx = useContext(AppContext);

  ctx.map = ctx.map ?? MapFactory.getMap(map);

  return (<></>);
}

/**
 * Leaflet map.
 */
export default function MapControl(): JSX.Element {

  const cnt = new LatLng(50.088349, 14.403679);
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const att = "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener noreferrer\">OpenStreetMap</a> | <a href=\"https://zhukovdm.github.io/smartwalk-docs/\" target=\"_blank\" rel=\"noopener noreferrer\">SmartWalk Docs</a>";

  return (
    <MapContainer
      id={"map"}
      center={cnt}
      scrollWheelZoom={true}
      zoom={11}
      zoomControl={false}
    >
      <TileLayer url={url} attribution={att} />
      <MapExtractor />
    </MapContainer>
  );
}
