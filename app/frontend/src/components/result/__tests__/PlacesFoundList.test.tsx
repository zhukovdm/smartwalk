import {
  fireEvent,
  within
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import PlacesFoundList, {
  type PlacesFoundListProps
} from "../PlacesFoundList";

const getProps = (): PlacesFoundListProps => ({
  map: new LeafletMap(),
  places: [
    [
      {
        ...getPlace(),
        name: "Place A",
        smartId: "A"
      },
      true
    ],
    [
      {
        ...getPlace(),
        name: "Place B",
        smartId: "B"
      },
      false
    ]
  ]
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<PlacesFoundList {...props} />, options);
}

describe("<PlacesFoundList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render list of items", () => {
    const { getByRole } = render();
    expect(within(getByRole("list", { name: "Places found" })).getAllByRole("listitem")).toHaveLength(2);
  });

  it("should render stored and common points in the list", () => {
    const { container } = render();
    expect(container.getElementsByClassName("stored-place")).toHaveLength(1);
    expect(container.getElementsByClassName("common-place")).toHaveLength(1);
  });

  it("should pass Fly to callback", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    const { getAllByRole } = render(
      {
        ...getProps(),
        map: map
      }
    );
    getAllByRole("button", { name: "Fly to" }).forEach((button) => {
      fireEvent.click(button);
    });
    expect(flyTo).toHaveBeenCalledTimes(2);
  });

  it("should render all point labels as links", () => {
    const { getByRole } = render();
    ["A", "B"].forEach((name) => {
      expect(getByRole("link", { name: `Place ${name}` })).toBeInTheDocument();
    });
  });
});
