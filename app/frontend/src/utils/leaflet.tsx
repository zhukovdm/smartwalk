import L, {
  BaseIconOptions,
  Icon,
  LatLng,
  LayerGroup,
  Map,
  Marker,
  PointExpression
} from "leaflet";
import * as ReactDOMServer from "react-dom/server";
import { WgsPoint, UiPlace, PlaceCategory } from "../domain/types";
import { IMap, IPin } from "../domain/interfaces";
import { point2place } from "./helpers";

const dir = process.env.PUBLIC_URL + "/assets/markers";

enum Color {
  Stored = "violet",
  Common = "blue",
  Target = "red",
  Source = "green",
  Center = "grey"
}

class LeafletFace implements BaseIconOptions {

  static preload(url: string) {
    const img = new Image();
    img.src = url;
    return img;
  };

  /* Preloads images and ensures not garbage-collected. */

  // @ts-ignore
  private markerImage: HTMLImageElement;

  // @ts-ignore
  private shadowImage: HTMLImageElement;

  iconAnchor?: PointExpression;
  iconSize?: PointExpression;
  iconUrl?: string;
  popupAnchor?: PointExpression;
  shadowSize?: PointExpression;
  shadowUrl?: string;

  constructor(color: string) {

    this.iconAnchor = [12, 41];
    this.iconSize = [25, 41];
    this.iconUrl = dir + `/colors/marker-icon-${color}.png`;
    this.popupAnchor = [1, -34];
    this.shadowSize = [41, 41];
    this.shadowUrl = dir + "/shadow/marker-shadow.png";

    // prevent garbage collection
    this.markerImage = LeafletFace.preload(this.iconUrl);
    this.shadowImage = LeafletFace.preload(this.shadowUrl);
  }
};

type PlacePopupProps = {
  place: UiPlace;
  categories: PlaceCategory[];
};

/**
 * Standard popup for any place on a map. Shows either categories or keywords
 * associated with a place. Uses simple HTML due to some Leaflet limitations.
 */
function PlacePopup({ place, categories }: PlacePopupProps): JSX.Element {

  const lst = categories.length === 0
    ? place.keywords
    : place.categories.map((c) => `${c + 1}: ${categories[c].keyword}`);

  return (
    <div>
      <strong>{place.name}</strong>
      <div>
        <hr style={{opacity: 0.7, margin: "0.25rem 0"}} />
        <div style={{
          columnGap: "12px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "220px"
        }}>
          {lst.map((itm, i) => (<div key={i}>{itm}</div>))}
        </div>
      </div>
    </div>
  );
}

class PlacePopupFactory {

  public static getPopup(place: UiPlace, categories: PlaceCategory[]): string {
    return ReactDOMServer.renderToString(
      <PlacePopup place={place} categories={categories} />);
  }
}

class LeafletConverter {

  private static ensureLonBounds(lon: number): number {
    return Math.min(Math.max(lon, -180.0), +180.0);
  }

  private static ensureLatBounds(lat: number): number {
    return Math.min(Math.max(lat, -85.06), +85.06);
  }

  public static latlng2point(ll: LatLng): WgsPoint {
    return {
      lon: LeafletConverter.ensureLonBounds(ll.lng),
      lat: LeafletConverter.ensureLatBounds(ll.lat)
    };
  }

  public static point2latlng(point: WgsPoint) {
    return new LatLng(point.lat, point.lon);
  }
}

class LeafletPin implements IPin {

  public place: UiPlace;
  public readonly marker: Marker<any>;

  public withDrag(drag: (point: WgsPoint) => void): IPin {

    this.marker.addEventListener("dragend", () => {
      this.place = point2place(LeafletConverter.latlng2point(this.marker.getLatLng()));
      this.marker.bindPopup(PlacePopupFactory.getPopup(this.place, []));
      drag(this.place.location);
    });

    return this;
  }

  public withCirc(map: IMap, radius: number): IPin {

    this.marker.addEventListener("dragstart", () => {
      map.clearShapes();
    });

    this.marker.addEventListener("dragend", () => {
      map.drawCircle(LeafletConverter.latlng2point(this.marker.getLatLng()), radius);
    });

    return this;
  }

  constructor(place: UiPlace, marker: Marker<any>) {
    this.place = place;
    this.marker = marker;
  }
}

export class LeafletMap implements IMap {

  private static readonly icons = {
    stored: new L.Icon(new LeafletFace(Color.Stored)),
    common: new L.Icon(new LeafletFace(Color.Common)),
    source: new L.Icon(new LeafletFace(Color.Source)),
    target: new L.Icon(new LeafletFace(Color.Target)),
    center: new L.Icon(new LeafletFace(Color.Center))
  };

  private readonly color: string = "green";
  private readonly fillOpacity: number = 0.2;

  private readonly map?: Map;
  private readonly shpLayer: LayerGroup;
  private readonly mrkLayer: LayerGroup;
  private pins: LeafletPin[];

  private addMarker(point: WgsPoint, icon: Icon<any>, draggable: boolean): Marker<any> {
    return L.marker(new LatLng(point.lat, point.lon), { icon: icon, draggable: draggable }).addTo(this.mrkLayer);
  }

  private generatePin(place: UiPlace, categories: PlaceCategory[], icon: Icon<any>, draggable: boolean): LeafletPin {
    const p = PlacePopupFactory.getPopup(place, categories);
    return new LeafletPin(place, this.addMarker(place.location, icon, draggable).bindPopup(p));
  }

  private appendPin(pin: LeafletPin): IPin {
    return this.pins[this.pins.push(pin) - 1];
  }

  private addPlace(place: UiPlace, categories: PlaceCategory[], icon: Icon<any>, draggable: boolean): IPin {
    return this.appendPin(this.generatePin(place, categories, icon, draggable));
  }

  constructor(map?: Map) {

    this.map = map;
    this.shpLayer = L.layerGroup();
    this.mrkLayer = L.layerGroup();

    if (!!map) {
      this.shpLayer = this.shpLayer.addTo(map);
      this.mrkLayer = this.mrkLayer.addTo(map);
    }

    this.pins = [];
  }

  public clear(): void {
    this.pins = [];
    this.shpLayer.clearLayers();
    this.mrkLayer.clearLayers();
  }

  public clearShapes(): void {
    this.shpLayer.clearLayers();
  }

  public flyTo(place: UiPlace): void {
    const pin = this.pins.find((pin) => pin.place === place); // ref. equality!

    if (pin) {
      const point = pin.place.location;
      this.map?.flyTo(new LatLng(point.lat, point.lon), this.map?.getZoom());
      pin.marker.openPopup();
    }
  }

  public addStored(place: UiPlace, categories: PlaceCategory[]): IPin {
    return this.addPlace(place, categories, LeafletMap.icons.stored, false);
  }

  public addCommon(place: UiPlace, categories: PlaceCategory[], draggable: boolean): IPin {
    return this.addPlace(place, categories, LeafletMap.icons.common, draggable);
  }

  public addSource(place: UiPlace, categories: PlaceCategory[], draggable: boolean): IPin {
    return this.addPlace(place, categories, LeafletMap.icons.source, draggable);
  }

  public addTarget(place: UiPlace, categories: PlaceCategory[], draggable: boolean): IPin {
    return this.addPlace(place, categories, LeafletMap.icons.target, draggable);
  }

  public addCenter(place: UiPlace, categories: PlaceCategory[], draggable: boolean): IPin {
    return this.addPlace(place, categories, LeafletMap.icons.center, draggable);
  }

  public drawCircle(center: WgsPoint, radius: number): void {
    if (radius < 0.0) { return; }
    L.circle(new LatLng(center.lat, center.lon), {
      color: this.color, fillColor: this.color, fillOpacity: this.fillOpacity, radius: radius
    }).addTo(this.shpLayer);
  }

  public drawPolygon(polygon: WgsPoint[]): void {
    if (polygon.length < 4) { return; }
    L.polygon(polygon.map(pt => LeafletConverter.point2latlng(pt)), {
      color: this.color, fillColor: this.color, fillOpacity: this.fillOpacity
    }).addTo(this.shpLayer);
  }

  public drawPolyline(polyline: WgsPoint[]): void {
    if (polyline.length < 2) { return; }
    L.polyline(polyline.map(pt => LeafletConverter.point2latlng(pt)), {
      color: this.color, fillColor: this.color, fillOpacity: this.fillOpacity
    }).addTo(this.shpLayer);
  }

  public captureLocation(callback: (point: WgsPoint) => void): void {
    if (!this.map) { return; }
    const style = this.map.getContainer().style;
    style.cursor = "crosshair";

    this.map.once("click", (e) => {
      if (!this.map) { return; }
      style.cursor = "";
      callback(LeafletConverter.latlng2point(this.map.mouseEventToLatLng(e.originalEvent)));
    });
  }
}
