import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { getPlace } from "../../../utils/testData";
import { LeafletMap } from "../../../utils/leaflet";
import TraversalWaypointList, {
  type TraversalWaypointListProps
} from "../TraversalWaypointList";

const getDefault = (): TraversalWaypointListProps => ({
  map: new LeafletMap(),
  waypoints: [
    [
      { ...getPlace(), name: "Place A" },
      true
    ],
    [
      { ...getPlace(), name: "Place B" },
      false
    ]
  ]
});

function render(props = getDefault()) {
  return rtlRender(<TraversalWaypointList {...props} />);
}

describe("<TraversalWaypointList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("role and name", () => {
    const { getByRole } = render();
    expect(getByRole("list", { name: "Waypoints" })).toBeInTheDocument();
  });

  test("generate listitems", () => {
    const { getAllByRole } = render();
    expect(getAllByRole("listitem").length).toBe(2);
  });

  test("pass flyTo", () => {
    const m = new LeafletMap();
    const f = jest.fn();
    jest.spyOn(m, "flyTo").mockImplementation(f);
    const { getAllByRole } = render({
      ...getDefault(),
      map: m
    });
    getAllByRole("button", { name: "Fly to" }).forEach((listitem) => {
      fireEvent.click(listitem);
    })
    expect(f).toHaveBeenCalledTimes(2);
  });
});
