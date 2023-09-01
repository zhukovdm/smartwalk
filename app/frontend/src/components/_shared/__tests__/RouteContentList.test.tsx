import {
  fireEvent,
  render as rtlRender,
  within
} from "@testing-library/react";
import { UiPlace } from "../../../domain/types";
import { LeafletMap } from "../../../utils/leaflet";
import { withRouter } from "../../../utils/testUtils";
import RouteContentList, { RouteContentListProps } from "../RouteContentList";

const getPlace = (name: string): UiPlace => ({
  name: name,
  keywords: ["castle"],
  location: {
    lon: 0.0,
    lat: 0.0
  },
  categories: []
});

const getDefault = (): RouteContentListProps => ({
  map: new LeafletMap(),
  source: getPlace("Place A"),
  target: getPlace("Place D"),
  places: [
    getPlace("Place B"),
    getPlace("Place C")
  ],
  filterList: [false, true, false]
});

function render(props = getDefault()) {
  return rtlRender(withRouter(<RouteContentList {...props} />));
}

describe("<RouteContentList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("source and target exist", () => {
    const { getByRole } = render();
    expect(getByRole("region", { name: "Starting point" }));
    expect(getByRole("region", { name: "Destination" }));
  });

  test("source and target fly", () => {
    const m = new LeafletMap();
    const f = jest.fn();
    jest.spyOn(m, "flyTo").mockImplementation(f);
    const { getByRole } = render({
      ...getDefault(),
      map: m
    });
    fireEvent.click(
      within(getByRole("region", { name: "Starting point" }))
        .getByRole("button", { name: "Fly to" }));

    fireEvent.click(
      within(getByRole("region", { name: "Destination" }))
        .getByRole("button", { name: "Fly to" }));

    expect(f).toHaveBeenCalledTimes(2);
  });

  describe("waypoints", () => {

    test("generated if filters", () => {
      const { getByRole } = render();
      expect(getByRole("list", { name: "Waypoints" })).toBeInTheDocument();
    });

    test("skipped if no filters", () => {
      const { queryAllByRole } = render({
        ...getDefault(),
        filterList: [false, false, false]
      });
      expect(queryAllByRole("list", { name: "Waypoints" }).length).toEqual(0);
    });
  })
});
