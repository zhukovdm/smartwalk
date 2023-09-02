import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import TraversableWaypointList, { TraversableWaypointListProps } from "../TraversableWaypointList";

const getDefault = (): TraversableWaypointListProps => ({
  map: new LeafletMap(),
  places: [
    {
      name: "Place A",
      keywords: [],
      location: {
        lon: 0.0,
        lat: 0.0
      },
      categories: []
    },
    {
      name: "Place B",
      keywords: [],
      location: {
        lon: 0.0,
        lat: 0.0
      },
      categories: []
    }
  ]
});

function render(props = getDefault()) {
  return rtlRender(<TraversableWaypointList {...props} />);
}

describe("<TraversableWaypointList />", () => {

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
