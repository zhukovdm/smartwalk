import { useContext } from "react";
import { LatLng } from "leaflet";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap
} from "react-leaflet";
import "leaflet.locatecontrol";
import { AppContext } from "../App";
import { MapFactory } from "../features/context";
import { useLocate } from "../features/mapHooks";

/**
 * Geolocation control.
 */
function LocateControl(): null {
  useLocate();
  return (null);
}

/**
 * Obtain Leaflet map and store in the context.
 */
function MapExtractor(): null {
  useContext(AppContext).map = MapFactory.getMap(useMap());
  return (null);
}

/**
 * Leaflet map container.
 */
export default function MapControl(): JSX.Element {

  const cnt = new LatLng(50.088349, 14.403679);
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const att = "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener noreferrer\">OpenStreetMap</a> | <a href=\"https://zhukovdm.github.io/smartwalk-docs/usr/\" target=\"_blank\" rel=\"noopener noreferrer\">SmartWalk Docs</a>";

  return (
    <MapContainer
      id={"map"}
      center={cnt}
      scrollWheelZoom={true}
      zoom={11}
      maxZoom={18}
      zoomControl={false}
    >
      <TileLayer url={url} attribution={att} />
      <ZoomControl position={"bottomright"} />
      <LocateControl />
      <MapExtractor />
    </MapContainer>
  );
}
