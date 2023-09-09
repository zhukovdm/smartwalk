import { fireEvent, waitFor, within } from "@testing-library/react";
import { Network } from "vis-network";
import type { StoredPlace } from "../../../domain/types";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace, getRoute } from "../../../utils/testData";
import { AppRenderOptions, renderWithProviders } from "../../../utils/testUtils";
import { initialViewerState } from "../../../features/viewerSlice";
import ViewerRouteContent, { type ViewerRouteContentProps } from "../ViewerRouteContent";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import { context } from "../../../features/context";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation(() => { })
}));

const getDefault = (): ViewerRouteContentProps => ({
  route: {
    ...getRoute(),
    name: "Route A",
    routeId: "1"
  }
});

const getStoredPlaces = (): StoredPlace[] => ([
  {
    ...getPlace(),
    name: "True source",
    placeId: "1"
  },
  {
    ...getPlace(),
    name: "Street market",
    placeId: "4",
    smartId: "C"
  }
]);

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<ViewerRouteContent {...props} />, options);
}

describe("<ViewerRouteContent />", () => {
  
  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render the header", () => {
    const { getByText } = render();
    expect(getByText("Route A")).toBeInTheDocument();
  });

  it("should render the distance without trailing zeros", () => {
    const { getByText } = render();
    expect(getByText("3.1")).toBeInTheDocument();
  });

  it("should render the arrows button", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "arrows" })).toBeInTheDocument();
  });

  test("arrow button opens arrow dialog", async () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "arrows" }));
    expect(getByRole("dialog", { name: "Arrows" })).toBeInTheDocument();
    expect(Network).toHaveBeenCalled();
  });

  test("arrow dialog hides upon Hide", async () => {
    const { getByRole, queryByRole } = render();
    fireEvent.click(getByRole("button", { name: "arrows" }));
    fireEvent.click(getByRole("button", { name: "Hide dialog" }));
    await waitFor(() => {
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("arrow dialog hides upon Escape", async () => {
    const { getByRole, queryByRole } = render();
    fireEvent.click(getByRole("button", { name: "arrows" }));
    fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
    await waitFor(() => {
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should render list of category filters (with listitems)", () => {
    const { getByRole } = render(getDefault(), {
      preloadedState: {
        viewer: {
          ...initialViewerState(),
          routeFilters: Array(5).fill(true)
        }
      }
    });
    const lst = getByRole("list", { name: "Category filters" });
    expect(lst).toBeInTheDocument();
    expect(within(lst).getAllByRole("listitem")).toHaveLength(5);
    expect(within(lst).getAllByRole("checkbox", { name: "Hide places" })).toHaveLength(5);
    expect(within(lst).getAllByRole("button", { name: "Show filters" })).toHaveLength(5);
  });

  it("should render source and target regions", () => {
    const { getByRole } = render();

    const sourceRegion = getByRole("region", { name: "Starting point" });
    expect(sourceRegion).toBeInTheDocument();
    expect(within(sourceRegion).queryByRole("link", { name: "Source" })).toBeInTheDocument();

    const targetRegion = getByRole("region", { name: "Destination" });
    expect(targetRegion).toBeInTheDocument();
    expect(within(targetRegion).getByText("Target")).toBeInTheDocument();
    expect(within(targetRegion).queryByRole("link")).not.toBeInTheDocument();
  });

  it("should not render list of waypoints if no filter is set", () => {
    const { queryByRole } = render();
    expect(queryByRole("list", { name: "Waypoints" })).not.toBeInTheDocument();
  });

  it("should render all waypoints (as links) if all filters are set", () => {
    const { getByRole } = render(getDefault(), {
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
    const { getByText, getAllByText } = render(getDefault(), {
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
      "True source",
      "Old statue",
      "Street market",
      "Movie theater",
      "Target"
    ].forEach((name) => { expect(getByText(name)).toBeInTheDocument(); });

    expect(getAllByText("Medieval castle")).toHaveLength(2);
  });

  it("should skip waypoints for all filters that are not set", () => {

    /**
     * More specifically, "Medieval castle" is represented by two waypoints
     * and one of them is skipped.
     */

    const { getByRole } = render(getDefault(), {
      preloadedState: {
        viewer: {
          ...initialViewerState(),
          routeFilters: [true, false, true, false, true]
                  // castle, museum, statue, market, cinema
        }
      }
    });
    const blk = within(getByRole("list", { name: "Waypoints" }));
    ["Old statue", "Medieval castle", "Movie theater"].forEach((name) => {
      expect(blk.getByRole("link", { name: name })).toBeInTheDocument();
    });
    expect(blk.queryByText("Flea market")).not.toBeInTheDocument();
    expect(blk.getAllByRole("listitem").length).toBe(3);
  });

  test("filter hides and shows only corresponding waypoint", () => {
    const { getByRole, queryByText } = render(getDefault(), {
      preloadedState: {
        viewer: {
          ...initialViewerState(),
          routeFilters: Array(5).fill(true)
        }
      }
    });
    fireEvent.click(within(getByRole("listitem", { name: "3: statue" })).getByRole("checkbox"));
    expect(within(getByRole("list", { name: "Waypoints" })).getAllByRole("listitem")).toHaveLength(4);
    expect(queryByText("Old statue")).not.toBeInTheDocument();
  });

  test("filter controls only one waypoint for a repeated point", () => {
    const { getByRole } = render(getDefault(), {
      preloadedState: {
        viewer: {
          ...initialViewerState(),
          routeFilters: Array(5).fill(true)
        }
      }
    });
    const list = getByRole("list", { name: "Waypoints" });
    expect(within(list).getAllByRole("listitem", { name: "Medieval castle" })).toHaveLength(2);
    fireEvent.click(within(getByRole("listitem", { name: "2: museum" })).getByRole("checkbox"));
    expect(within(list).getAllByRole("listitem", { name: "Medieval castle" })).toHaveLength(1);
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

    render(getDefault(), {
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

  it("should fly to the source on the first render", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    render(getDefault(), { context: { ...context, map: map } });
    expect(flyTo).toHaveBeenCalledWith(getDefault().route.source);
  });

  it("should fly upon click on Fly to", () => {
    const map = new LeafletMap();
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());

    const { getAllByRole } = render(getDefault(), {
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
