import { fireEvent, within } from "@testing-library/react";
import type { StoredPlace } from "../../../domain/types";
import { context } from "../../../features/context";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import { LeafletMap } from "../../../utils/leaflet";
import { getDirec, getPlace } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import ViewerDirecContent, { type ViewerDirecContentProps } from "../ViewerDirecContent";

const getDefault = (): ViewerDirecContentProps => ({
  direc: {
    ...getDirec(),
    name: "Direction A",
    direcId: "1"
  }
});

const getStoredPlaces = (): StoredPlace[] => ([
  {
    ...getPlace(),
    name: "Place X",
    placeId: "2"
  },
  {
    ...getPlace(),
    name: "Place Y",
    placeId: "4",
    smartId: "D"
  }
]);

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<ViewerDirecContent {...props} />, options);
}

describe("<ViewerDirecContent />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render the header", () => {
    const { getByText } = render();
    expect(getByText("Direction A")).toBeInTheDocument();
  });

  it("should render the distance without trailing zeros", () => {
    const { getByText } = render();
    expect(getByText("3.1")).toBeInTheDocument();
  });

  it("should render list of waypoints", () => {
    const { getByRole } = render();
    expect(getByRole("list", { name: "Waypoints" })).toBeInTheDocument();
  });

  it("should render waypoint listitems (with replacement)", () => {
    const { getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: getStoredPlaces()
        }
      }
    });
    const list = getByRole("list", { name: "Waypoints" });
    expect(within(list).getAllByRole("button").length).toBe(5);
    expect(within(list).getAllByRole("listitem").length).toBe(5);
    ["A", "X", "C", "Y", "E"].forEach((letter) => {
      expect(within(list).getByText(`Place ${letter}`)).toBeInTheDocument();
    });
  });

  it("should draw common and stored places", () => {
    const map = new LeafletMap();

    const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const drawPolyline = jest.spyOn(map, "drawPolyline").mockImplementation(jest.fn());

    render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: getStoredPlaces()
        }
      },
      context: { ...context, map: map }
    });

    expect(clear).toHaveBeenCalled();
    expect(addStored).toHaveBeenCalledTimes(2);
    expect(addCommon).toHaveBeenCalledTimes(3);
    expect(drawPolyline).toHaveBeenCalled();
  });

  it("should fly upon click on Fly to (for all waypoints)", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());

    const { getAllByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: getStoredPlaces()
        }
      },
      context: { ...context, map: map }
    });
    getAllByRole("button", { name: "Fly to" }).forEach((button) => {
      fireEvent.click(button);
    });
    expect(flyTo).toHaveBeenCalledTimes(6);
  });

  it("should generate link for all stored places and text otherwise", () => {
    const { getAllByRole, getByRole, getByText } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: getStoredPlaces()
        }
      }
    });

    ["A", "X", "C"].forEach((name) => {
      expect(getByText(`Place ${name}`)).toBeInTheDocument();
    });

    expect(getAllByRole("link")).toHaveLength(2);
    ["Y", "E"].forEach((name) => {
      expect(getByRole("link", { name: `Place ${name}` })).toBeInTheDocument();
    });
  });
});
