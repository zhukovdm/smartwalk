import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { Network } from "vis-network";
import type { StoredPlace } from "../../../domain/types";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace, getRoute } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import {
  initialFavoritesState
} from "../../../features/favoritesSlice";
import {
  initialViewerState
} from "../../../features/viewerSlice";
import ViewerRouteContent, {
  type ViewerRouteContentProps
} from "../ViewerRouteContent";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation(() => { })
}));

const getProps = (): ViewerRouteContentProps => ({
  route: {
    ...getRoute(),
    name: "Route A",
    routeId: "1"
  }
});

const getStoredPlaces = (): StoredPlace[] => ([
  {
    ...getPlace(),
    name: "Source X",
    placeId: "1"
  },
  {
    ...getPlace(),
    name: "Place Y",
    placeId: "4",
    smartId: "C"
  }
]);

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<ViewerRouteContent {...props} />, options);
}

describe("<ViewerRouteContent />", () => {
  
  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("header", () => {

    it("should render the header", () => {
      const { getByText } = render();
      expect(getByText("Route A")).toBeInTheDocument();
    });
  });

  describe("distance", () => {

    it("should render the distance without trailing zeros", () => {
      const { getByText } = render();
      expect(getByText("3.1")).toBeInTheDocument();
    });
  });

  describe("arrows", () => {

    it("should render the `arrows` button", () => {
      const { getByRole } = render();
      expect(getByRole("button", { name: "arrows" })).toBeInTheDocument();
    });
  
    test("arrows button opens arrows dialog and draws a graph", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "arrows" }));
      expect(getByRole("dialog", { name: "Arrows" })).toBeInTheDocument();
      expect(Network).toHaveBeenCalled();
    });
  
    test("arrows dialog should hide upon Hide", async () => {
      const { getByRole, queryByRole } = render();
      fireEvent.click(getByRole("button", { name: "arrows" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Hide dialog" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  
    test("arrows dialog should hide upon Escape", async () => {
      const { getByRole, queryByRole } = render();
      fireEvent.click(getByRole("button", { name: "arrows" }));
      act(() => {
        fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
      })
      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("category filters", () => {

    it("should render list of category filters (with listitems)", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          viewer: {
            ...initialViewerState(),
            routeFilters: Array(5).fill(true)
          }
        }
      });
      const list = getByRole("list", { name: "Category filters" });
      ["castle", "museum", "statue", "market", "cinema"].forEach((filterName, i) => {
        expect(within(list).getByText(`${i + 1}: ${filterName}`)).toBeInTheDocument();
      });
      expect(within(list).getAllByRole("listitem")).toHaveLength(5);
      expect(within(list).getAllByRole("checkbox", { name: "Hide places" })).toHaveLength(5);
      expect(within(list).getAllByRole("button", { name: "Show filters" })).toHaveLength(5);
    });

    test("filter hides and shows only corresponding waypoint", () => {
      const { getByRole, queryByText } = render(getProps(), {
        preloadedState: {
          viewer: {
            ...initialViewerState(),
            routeFilters: Array(5).fill(true)
          }
        }
      });
      expect(queryByText("Place B")).toBeInTheDocument();
      fireEvent.click(within(getByRole("listitem", { name: "3: statue" })).getByRole("checkbox"));
      expect(within(getByRole("list", { name: "Waypoints" })).getAllByRole("listitem")).toHaveLength(4);
      expect(queryByText("Place B")).not.toBeInTheDocument();
    });

    test("filter controls only one waypoint for a repeated point", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          viewer: {
            ...initialViewerState(),
            routeFilters: Array(5).fill(true)
          }
        }
      });
      const list = getByRole("list", { name: "Waypoints" });
      expect(within(list).getAllByRole("listitem", { name: "Place A" })).toHaveLength(2);
      fireEvent.click(within(getByRole("listitem", { name: "2: museum" })).getByRole("checkbox"));
      expect(within(list).getAllByRole("listitem", { name: "Place A" })).toHaveLength(1);
    });
  });

  describe("regions", () => {

    it("should render source and target regions", () => {
      const { getByRole } = render();
  
      const sourceRegion = getByRole("region", { name: "Starting point" });
      expect(sourceRegion).toBeInTheDocument();
      expect(within(sourceRegion).queryByRole("link", { name: "Source S" })).toBeInTheDocument();
  
      const targetRegion = getByRole("region", { name: "Destination" });
      expect(targetRegion).toBeInTheDocument();
      expect(within(targetRegion).getByText("Target T")).toBeInTheDocument();
      expect(within(targetRegion).queryByRole("link")).not.toBeInTheDocument();
    });
  
    it("should not render list of waypoints if no filter is set", () => {
      const { queryByRole } = render();
      expect(queryByRole("list", { name: "Waypoints" })).not.toBeInTheDocument();
    });
  
    it("should render all waypoints (as links) if all filters are set", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          viewer: {
            ...initialViewerState(),
            routeFilters: Array(5).fill(true)
          }
        }
      });
      const list = getByRole("list", { name: "Waypoints" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(5);
      expect(within(list).getAllByRole("link")).toHaveLength(5);
    });
  
    it("should render point names with replacement", () => {
      const { getByText, getAllByText } = render(getProps(), {
        preloadedState: {
          favorites: {
            ...initialFavoritesState(),
            places: getStoredPlaces()
          },
          viewer: {
            ...initialViewerState(),
            routeFilters: Array(5).fill(true)
          }
        }
      });
  
      [
        "Source X",
        "Place B",
        "Place Y",
        "Place D",
        "Target T"
      ].forEach((name) => { expect(getByText(name)).toBeInTheDocument(); });
      expect(getAllByText("Place A")).toHaveLength(2);
    });
  
    it("should hide waypoints for all filters that are not set", () => {
  
      /**
       * More specifically, "Medieval castle" is represented by two waypoints.
       * One of them is omitted, and another is shown.
       */
  
      const { getByRole } = render(getProps(), {
        preloadedState: {
          viewer: {
            ...initialViewerState(),
            routeFilters: [true, false, true, false, true]
                    // castle, museum, statue, market, cinema
          }
        }
      });
      const list = getByRole("list", { name: "Waypoints" });
  
      ["A", "B", "D"].forEach((id) => {
        expect(within(list).getByRole("link", { name: `Place ${id}` })).toBeInTheDocument();
      });
      ["C"].forEach((name) => {
        expect(within(list).queryByText(name)).not.toBeInTheDocument();
      });
      expect(within(list).getAllByRole("listitem").length).toBe(3);
    });
  });

  it("should draw route on the map", () => {

    /**
     * More specifically, procedure should avoid drawing repeated points and
     * fly to the source.
     */

    const map = new LeafletMap();
    const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
    const addSource = jest.spyOn(map, "addSource").mockImplementation(jest.fn());
    const addTarget = jest.spyOn(map, "addTarget").mockImplementation(jest.fn());
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());
    const drawPolyline = jest.spyOn(map, "drawPolyline").mockImplementation(jest.fn());

    render(getProps(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: getStoredPlaces()
        },
        viewer: {
          ...initialViewerState(),
          routeFilters: Array(5).fill(true)
        }
      },
      context: { ...context, map: map }
    });

    expect(clear).toHaveBeenCalled();
    expect(addSource).toHaveBeenCalledTimes(1);
    expect(addTarget).toHaveBeenCalledTimes(1);
    expect(addCommon).toHaveBeenCalledTimes(3);
    expect(addStored).toHaveBeenCalledTimes(1);
    expect(drawPolyline).toHaveBeenCalled();
  });

  it("should fly to the source on mount", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    render(getProps(), { context: { ...context, map: map } });
    expect(flyTo).toHaveBeenCalledWith(getProps().route.source);
  });

  it("should fly upon click on Fly to", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());

    const { getAllByRole } = render(getProps(), {
      preloadedState: {
        viewer: {
          ...initialViewerState(),
          routeFilters: Array(5).fill(true)
        }
      },
      context: { ...context, map: map }
    });
    const buttons = getAllByRole("button", { name: "Fly to" });
    expect(buttons).toHaveLength(7);
    buttons.forEach((button) => { fireEvent.click(button); });
    expect(flyTo).toHaveBeenCalledTimes(8);
  });
});
