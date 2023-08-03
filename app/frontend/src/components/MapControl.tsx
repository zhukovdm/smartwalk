import { useContext } from "react";
import { LatLng } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { AppContext } from "../App";
import { MapFactory } from "../features/context";

function MapExtractor(): JSX.Element {

  const map = useMap();
  const context = useContext(AppContext);
  context.map = context.map ?? MapFactory.getMap(map);

  return (<></>);
}

export default function MapControl(): JSX.Element {

  const cnt = new LatLng(50.088349, 14.403679);
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const att = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://grainpath.github.io/docs/" target="_blank">GrainPath Docs</a>';

  return (
    <MapContainer id={"map"} center={cnt} scrollWheelZoom={true} zoom={11} zoomControl={false}>
      <TileLayer url={url} attribution={att} />
      <MapExtractor />
    </MapContainer>
  );
}
