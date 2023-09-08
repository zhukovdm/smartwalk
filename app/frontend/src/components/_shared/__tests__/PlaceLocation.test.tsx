import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import PlaceLocation from "../PlaceLocation";

const getDefault = () => ({
  map: new LeafletMap(),
  place: {
    name: "Place",
    location: {
      lon: 0.0,
      lat: 0.0
    },
    keywords: [],
    categories: []
  },
  isStored: false
});

function render(props = getDefault()) {
  return rtlRender(<PlaceLocation {...props} />);
}

describe("<PlaceLocation />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("button title", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
  });

  test("button fly", () => {
    const m = new LeafletMap();
    const flyTo = jest.spyOn(m, "flyTo").mockImplementation(() => {});
    const { getByRole } = render({
      ...getDefault(),
      map: m
    });
    fireEvent.click(getByRole("button"));
    expect(flyTo).toHaveBeenCalledTimes(1);
  });

  test("text content", () => {
    const { getByText } = render();
    expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();
  });

  test("text fly", () => {
    const m = new LeafletMap();
    const flyTo = jest.spyOn(m, "flyTo").mockImplementation(jest.fn());
    const { getByText } = render({
      ...getDefault(),
      map: m
    });
    fireEvent.click(getByText("0.000000N, 0.000000E"));
    expect(flyTo).toHaveBeenCalledTimes(1);
  });
});
