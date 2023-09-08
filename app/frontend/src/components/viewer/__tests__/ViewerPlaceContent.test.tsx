import { fireEvent, within } from "@testing-library/react";
import { getPlace } from "../../../utils/testData";
import { AppRenderOptions, renderWithProviders } from "../../../utils/testUtils";
import ViewerPlaceContent, { ViewerPlaceContentProps } from "../ViewerPlaceContent";
import { context } from "../../../features/context";
import { LeafletMap } from "../../../utils/leaflet";

const getDefault = (): ViewerPlaceContentProps => ({
  place: {
    ...getPlace(),
    name: "Place A",
    placeId: "1"
  }
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<ViewerPlaceContent {...props} />, options);
}

describe("<ViewerPlaceContent />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render simple header", () => {
    const { getByText } = render();
    expect(getByText("Place A")).toBeInTheDocument();
  });

  it("should render linked header", () => {
    const { getByRole } = render({
      place: { ...getDefault().place, smartId: "A" }
    });
    expect(getByRole("link", { name: "Place A" })).toBeInTheDocument();
  });

  it("renders place location", () => {
    const { getByRole, getByText } = render();
    expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
    expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();
  });

  it("renders a list of keywords", () => {
    const { getByRole } = render({
      place: {
        ...getDefault().place,
        keywords: ["castle", "museum"]
      }
    });
    const list = getByRole("list", { name: "Keywords" });
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  test("camera flies upon Fly to", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    const { getByRole } = render(getDefault(), { context: { ...context, map: map } });
    fireEvent.click(getByRole("button", { name: "Fly to" }));
    expect(flyTo).toHaveBeenCalledTimes(2);
  });

  it("draws point on the map (with flyTo)", () => {
    const map = new LeafletMap();

    const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());

    render(getDefault(), {
      context: { ...context, map: map }
    });

    expect(clear).toHaveBeenCalled();
    expect(addStored).toHaveBeenCalled();
    expect(flyTo).toHaveBeenCalled();
  });
});
