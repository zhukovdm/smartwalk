import {
  fireEvent,
  render as rtlRender,
  within
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { withRouter } from "../../../utils/testUtils";
import RouteContentList, { RouteContentListProps } from "../RouteContentList";
import { getPlace } from "../../../utils/testData";

const getDefault = (): RouteContentListProps => ({
  map: new LeafletMap(),
  source: { ...getPlace(), name: "Place A" },
  target: { ...getPlace(), name: "Place D" },
  waypoints: [
    [
      { ...getPlace(), name: "Place B" },
      true
    ],
    [
      { ...getPlace(), name: "Place C" },
      false
    ]
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
