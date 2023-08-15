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
import { IMap, IPin } from "../domain/interfaces";
import { WgsPoint, UiPlace } from "../domain/types";
import { point2place } from "./helpers";

const pos = "bottomright";
const dir = process.env.PUBLIC_URL + "/assets/markers";

enum Color {
  R = "red",
  G = "green",
  B = "blue",
  V = "violet",
  Y = "grey"
}

class LeafletFace implements BaseIconOptions {

  static preload(url: string) { const img = new Image(); img.src = url; return img; };

  /* Preloads images and ensures not garbage-collected. */

  // @ts-ignore
  private markerImage: HTMLImageElement;

  // @ts-ignore
  private shadowImage: HTMLImageElement;

  iconUrl?: string;
  shadowUrl?: string;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  shadowSize?: PointExpression;
  popupAnchor?: PointExpression;

  constructor(color: string) {

    this.iconUrl = dir + `/colors/marker-icon-${color}.png`;
    this.shadowUrl = dir + "/shadow/marker-shadow.png";
    this.iconSize = [25, 41];
    this.iconAnchor = [12, 41];
    this.shadowSize = [41, 41];
    this.popupAnchor = [1, -34];

    // prevent garbage collection
    this.markerImage = LeafletFace.preload(this.iconUrl);
    this.shadowImage = LeafletFace.preload(this.shadowUrl);
  }
};

type PlacePopupProps = {
  place: UiPlace;
};

/**
 * Standard popup for any place on a map. Use simple HTML due to some
 * Leaflet limitations.
 */
function PlacePopup({ place }: PlacePopupProps): JSX.Element {

  const set = new Set(place.categories);

  return (
    <div>
      <strong>{place.name}</strong>
      {place.keywords.length > 0 &&
        <div>
          <hr style={{opacity: 0.7, margin: "0.25rem 0"}} />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "12px", width: "220px" }}>
            {place.keywords.map((keyword, i) =>
              <div key={i}>
                {set.has(keyword) ? <strong>{keyword}</strong> : <span style={{ color: "grey" }}>{keyword}</span>}
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}

class PlacePopupFactory {
  public static getPopup(place: UiPlace): string {
    return ReactDOMServer.renderToString(<PlacePopup place={place} />);
  }
}

class LeafletConverter {

  // https://epsg.io/3857
  private static ensureLonBounds (lon: number): number { return Math.min(Math.max(lon, -180.0), +180.0); }
  private static ensureLatBounds (lat: number): number { return Math.min(Math.max(lat, -85.06), +85.06); }

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

  /**
   * Action upon event on dragend (when user releases marker on a new position).
   */
  public withDrag(drag: (point: WgsPoint) => void): IPin {
    this.marker.addEventListener("dragend", () => {
      this.place = point2place(LeafletConverter.latlng2point(this.marker.getLatLng()));
      this.marker.bindPopup(PlacePopupFactory.getPopup(this.place));
      drag(this.place.location);
    });
    return this;
  }

  public withCirc(map: IMap, radius: number): IPin {
    this.marker.addEventListener("dragend", () => {
      map.clearShapes();
      map.drawCircle(LeafletConverter.latlng2point(this.marker.getLatLng()), radius);
    });
    return this;
  }

  constructor(place: UiPlace, marker: Marker<any>) {
    this.place = place; this.marker = marker;
  }
}

export class LeafletMap implements IMap {

  private static readonly icons = {
    source: new L.Icon(new LeafletFace(Color.G)),
    target: new L.Icon(new LeafletFace(Color.R)),
    tagged: new L.Icon(new LeafletFace(Color.B)),
    stored: new L.Icon(new LeafletFace(Color.V)),
    custom: new L.Icon(new LeafletFace(Color.Y)),
  };

  private readonly color: string = "green";
  private readonly fillOpacity: number = 0.2;

  private readonly map: Map;
  private readonly shapeLayer: LayerGroup;
  private readonly markerLayer: LayerGroup;
  private pins: LeafletPin[];

  private addMarker(point: WgsPoint, icon: Icon<any>, draggable: boolean): Marker<any> {
    return L.marker(new LatLng(point.lat, point.lon), { icon: icon, draggable: draggable }).addTo(this.markerLayer);
  }

  private addPlace(place: UiPlace, icon: Icon<any>, draggable: boolean): LeafletPin {
    const p = PlacePopupFactory.getPopup(place);
    return new LeafletPin(place, this.addMarker(place.location, icon, draggable).bindPopup(p));
  }

  private appendPin(pin: LeafletPin): IPin {
    return this.pins[this.pins.push(pin) - 1];
  }

  constructor(map: Map) {

    this.map = map;
    this.shapeLayer = L.layerGroup().addTo(map);
    this.markerLayer = L.layerGroup().addTo(map);
    L.control.zoom({ position: pos }).addTo(map);
    L.control.locate({ position: pos }).addTo(map);
    this.pins = [];
  }

  public clear(): void {
    this.pins = [];
    this.shapeLayer.clearLayers();
    this.markerLayer.clearLayers();
  }

  public clearShapes(): void { this.shapeLayer.clearLayers(); }

  public flyTo(place: UiPlace): void {
    const pin = this.pins.find(pin => pin.place === place);
    if (pin) {
      const point = pin.place.location;
      this.map.flyTo(new LatLng(point.lat, point.lon), this.map.getZoom());
      pin.marker.openPopup();
    }
  }

  public addStored(place: UiPlace): IPin {
    return this.appendPin(this.addPlace(place, LeafletMap.icons.stored, false));
  }

  public addTagged(place: UiPlace): IPin {
    return this.appendPin(this.addPlace(place, LeafletMap.icons.tagged, false));
  }

  public addCustom(place: UiPlace, draggable: boolean = true): IPin {
    return this.appendPin(this.addPlace(place, LeafletMap.icons.custom, draggable));
  }

  public addSource(place: UiPlace, draggable: boolean = true): IPin {
    return this.appendPin(this.addPlace(place, LeafletMap.icons.source, draggable));
  }

  public addTarget(place: UiPlace, draggable: boolean = true): IPin {
    return this.appendPin(this.addPlace(place, LeafletMap.icons.target, draggable));
  }

  public drawCircle(center: WgsPoint, radius: number): void {
    if (radius < 0.0) { return; }
    L.circle(new LatLng(center.lat, center.lon), {
      color: this.color, fillColor: this.color, fillOpacity: this.fillOpacity, radius: radius
    }).addTo(this.shapeLayer);
  }

  public drawPolygon(polygon: WgsPoint[]): void {
    if (polygon.length < 4) { return; }
    L.polygon(polygon.map(pt => LeafletConverter.point2latlng(pt)), {
      color: this.color, fillColor: this.color, fillOpacity: this.fillOpacity
    }).addTo(this.shapeLayer);
  }

  public drawPolyline(polyline: WgsPoint[]): void {
    if (polyline.length < 2) { return; }
    L.polyline(polyline.map(pt => LeafletConverter.point2latlng(pt)), {
      color: this.color, fillColor: this.color, fillOpacity: this.fillOpacity
    }).addTo(this.shapeLayer);
  }

  public captureLocation(callback: (point: WgsPoint) => void): void {
    const style = this.map.getContainer().style;
    style.cursor = "crosshair";

    this.map.once("click", (e) => {
      style.cursor = "";
      callback(LeafletConverter.latlng2point(this.map.mouseEventToLatLng(e.originalEvent)));
    });
  }
}
