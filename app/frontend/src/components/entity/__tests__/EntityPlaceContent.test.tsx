import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getExtendedPlace } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import EntityPlaceContent, {
  type EntityPlaceContentProps
} from "../EntityPlaceContent";
import EntityPlaceHelmet from "../EntityPlaceHelmet";

jest.mock("../EntityPlaceHelmet");

const getDefault = (): EntityPlaceContentProps => ({
  place: getExtendedPlace()
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<EntityPlaceContent {...props} />, options);
}

describe("<EntityPlaceContent />", () => {

  test("render", async () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render helmet", () => {
    render();
    expect(EntityPlaceHelmet).toHaveBeenCalled();
  })

  it("should render name", () => {
    const { getByText } = render();
    expect(getByText(getDefault().place.name)).toBeInTheDocument();
  });

  it("should draw point and polygon", () => {
    const map = new LeafletMap();

    const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    const drawPolygon = jest.spyOn(map, "drawPolygon").mockImplementation(jest.fn());
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());

    render(getDefault(), { context: { ...context, map: map } });

    expect(clear).toHaveBeenCalled();
    expect(flyTo).toHaveBeenCalled();
    expect(drawPolygon).toHaveBeenCalled();
    expect(addCommon).toHaveBeenCalled();
    expect(addStored).not.toHaveBeenCalled();
  });

  it("should show informative alert", () => {
    const { getByRole } = render();
    expect(within(getByRole("alert")).getByText("This place is not in your Favorites yet.")).toBeInTheDocument();
  });

  it("should redraw alert and map upon Save", async () => {
    const map = new LeafletMap();
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());

    const { getByRole } = render(getDefault(), { context: { ...context, map: map } });
    expect(addCommon).toHaveBeenCalledTimes(1);
    expect(addStored).toHaveBeenCalledTimes(0);

    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(within(getByRole("alert")).getByText("Medieval castle")).toBeInTheDocument();
    });

    expect(addCommon).toHaveBeenCalledTimes(1);
    expect(addStored).toHaveBeenCalledTimes(1);
  });

  it("should generate Address", () => {
    const { getByRole } = render();
    expect(within(getByRole("region", { name: "Address" })).getByText("Malostranske namesti, 1, 100 00, Prague 1, Prague, Czech Republic")).toBeInTheDocument();
  });

  
});
