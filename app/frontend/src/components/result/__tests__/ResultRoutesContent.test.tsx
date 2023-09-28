import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { Network } from "vis-network";
import { getPlace, getRoute } from "../../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import InmemStorage from "../../../utils/inmemStorage";
import { LeafletMap } from "../../../utils/leaflet";
import { context } from "../../../features/context";
import { initialResultRoutesState } from "../../../features/resultRoutesSlice";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import ResultRoutesContent from "../ResultRoutesContent";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation()
}));

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

const getState = (): AppRenderOptions => ({
  preloadedState: {
    resultRoutes: {
      ...initialResultRoutesState(),
      result: Array(3).fill(undefined).map(() => getRoute()),
      categoryFilters: Array(getRoute().categories.length).fill(true)
    }
  }
});

function render(options: AppRenderOptions = getState()) {
  return renderWithProviders(<ResultRoutesContent />, options);
}

describe("<ResultRoutesContent />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("header", () => {

    it("should generate text for =1 route, and =1 category", () => {
      const { getByText } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: [
              {
                ...getRoute(),
                categories: [
                  { keyword: "castle", filters: {} },
                ],
                arrows: [],
                places: [
                  {
                    ...getPlace(),
                    name: "Place A",
                    smartId: "A",
                    categories: [0]
                  }
                ]
              }
            ],
            categoryFilters: [true]
          }
        }
      });
      expect(getByText("Found a total of", { exact: false }))
        .toHaveTextContent("Found a total of 1 route with a distance of at most 5 km, visiting at least one place from the following category (arranged by arrows):");
    });

    it("should generate text for >1 route, and >1 category", () => {
      const { getByText } = render();
      expect(getByText("Found a total of", { exact: false }))
        .toHaveTextContent("Found a total of 3 routes with distances of at most 5 km, visiting at least one place from each of the following categories (arranged by arrows):");
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
      const { getByRole } = render();
      const list = getByRole("list", { name: "Category filters" });
      ["castle", "museum", "statue", "market", "cinema"].forEach((filterName, i) => {
        expect(within(list).getByText(`${i + 1}: ${filterName}`)).toBeInTheDocument();
      });
      expect(within(list).getAllByRole("listitem")).toHaveLength(5);
      expect(within(list).getAllByRole("checkbox", { name: "Hide places" })).toHaveLength(5);
      expect(within(list).getAllByRole("button", { name: "Show filters" })).toHaveLength(5);
    });

    test("filter hides and shows only corresponding waypoint", () => {
      const { getByRole, queryByText } = render();
      expect(queryByText("Place B")).toBeInTheDocument();
      fireEvent.click(within(getByRole("listitem", { name: "3: statue" })).getByRole("checkbox"));
      expect(within(getByRole("list", { name: "Waypoints" })).getAllByRole("listitem")).toHaveLength(4);
      expect(queryByText("Place B")).not.toBeInTheDocument();
    });

    test("filter controls only one waypoint for a repeated point", () => {
      const { getByRole } = render();
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

    it("should render source and target regions with replacement", () => {
      const { getByRole } = render({
        preloadedState: {
          ...getState().preloadedState,
          favorites: {
            ...initialFavoritesState(),
            places: [
              {
                ...getPlace(),
                name: "Source X",
                placeId: "1",
                smartId: "S"
              },
              {
                ...getPlace(),
                name: "Target Y",
                placeId: "2"
              }
            ]
          }
        }
      });
  
      const sourceRegion = getByRole("region", { name: "Starting point" });
      expect(sourceRegion).toBeInTheDocument();
      expect(within(sourceRegion).getByRole("link", { name: "Source X" })).toBeInTheDocument();
  
      const targetRegion = getByRole("region", { name: "Destination" });
      expect(targetRegion).toBeInTheDocument();
      expect(within(targetRegion).getByText("Target Y")).toBeInTheDocument();
      expect(within(targetRegion).queryByRole("link")).not.toBeInTheDocument();
    });

    it("should render waypoint names with replacement", () => {
      const { getByRole } = render({
        preloadedState: {
          ...getState().preloadedState,
          favorites: {
            ...initialFavoritesState(),
            places: [
              {
                ...getPlace(),
                name: "Place X",
                placeId: "2",
                smartId: "B"
              },
              {
                ...getPlace(),
                name: "Place Y",
                placeId: "4",
                smartId: "D"
              }
            ]
          }
        }
      });
      const list = getByRole("list", { name: "Waypoints" });
      ["X", "C", "Y"].forEach((id) => {
        expect(within(list).getByRole("listitem", { name: `Place ${id}` })).toBeInTheDocument();
      });
      expect(within(list).queryAllByRole("listitem", { name: `Place A` })).toHaveLength(2);
      ["B", "D"].forEach((id) => {
        expect(within(list).queryByRole("listitem", { name: `Place ${id}` })).not.toBeInTheDocument();
      });
      expect(within(list).queryAllByRole("listitem")).toHaveLength(5);
    });

    it("should render all waypoints if all filters are set", () => {
      const { getByRole } = render();
      const list = getByRole("list", { name: "Waypoints" });
      ["B", "C", "D"].forEach((id) => {
        expect(within(list).getByRole("listitem", { name: `Place ${id}` })).toBeInTheDocument()
      });
      expect(within(list).getAllByRole("listitem", { name: "Place A" })).toHaveLength(2);
      expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    });

    it("should not render list of waypoints if no filter is set", () => {
      const { queryByRole } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: Array(3).fill(undefined).map(() => getRoute()),
            categoryFilters: Array(getRoute().categories.length).fill(false)
          }
        }
      });
      expect(queryByRole("list", { name: "Waypoints" })).not.toBeInTheDocument();
    });

    it("should hide waypoints for all filters that are not set", () => {

      /**
       * More specifically, "Place A" is represented by two waypoints.
       * One of them is omitted, and another is shown.
       */
  
      const { getByRole } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: Array(3).fill(undefined).map(() => getRoute()),
            categoryFilters: [false, true, false, true, false]
                        // castle, museum, statue, market, cinema
          }
        }
      });

      const list = getByRole("list", { name: "Waypoints" });

      ["A", "C"].forEach((id) => {
        expect(within(list).getByRole("link", { name: `Place ${id}` })).toBeInTheDocument();
      });
      ["B", "D"].forEach((id) => {
        expect(within(list).queryByText(`Place ${id}`)).not.toBeInTheDocument();
      });
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    });
  });

  describe("pagination", () => {

    it("should have (N + 2) buttons", () => {
      const { getByRole } = render();
      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(3 + 2);
    });

    it("should show Nth route upon clicking on N", () => {
      const { getByRole, queryByText } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: [
              getRoute(),
              { ...getRoute(), name: "Route B", routeId: "1" },
              getRoute()
            ]
          }
        }
      });
      expect(queryByText("Route B")).not.toBeInTheDocument();
      fireEvent.click(getByRole("button", { name: "Go to page 2" }));
      expect(queryByText("Route B")).toBeInTheDocument();
    });

    it("should show next route upon click on Next", () => {
      const { getByRole, queryByText } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: [
              getRoute(),
              { ...getRoute(), name: "Route B", routeId: "1" },
              getRoute()
            ]
          }
        }
      });
      expect(queryByText("Route B")).not.toBeInTheDocument();
      fireEvent.click(getByRole("button", { name: "Go to next page" }));
      expect(queryByText("Route B")).toBeInTheDocument();
    });

    it("should show previous route upon click on Previous", () => {
      const { getByRole, queryByText } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            index: 1,
            result: [
              { ...getRoute(), name: "Route A", routeId: "0" },
              getRoute(),
              getRoute()
            ]
          }
        }
      });
      expect(queryByText("Route A")).not.toBeInTheDocument();
      fireEvent.click(getByRole("button", { name: "Go to previous page" }));
      expect(queryByText("Route A")).toBeInTheDocument();
    });
  });

  describe("alert", () => {

    it("should generate alert for unstored route", () => {
      const { getByText } = render();
      expect(getByText("This route is not in your Favorites yet.")).toBeInTheDocument();
    });

    it("should generate alert for stored route", () => {
      const { getByText } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: [
              { ...getRoute(), routeId: "1", name: "Route A" }
            ]
          }
        }
      });
      expect(getByText("Saved as", { exact: false })).toHaveTextContent("Saved as Route A.");
    });
  });

  describe("distance", () => {

    it("should render `maximum` distance without trailing zeros", () => {
      const { getByText } = render();
      expect(getByText("5")).toBeInTheDocument();
    });

    it("should render `actual` distance without trailing zeros", () => {
      const { getByText } = render();
      expect(getByText("3.1")).toBeInTheDocument();
    });
  });

  describe("menu & dialogs", () => {

    it("should have Save and Modify options", () => {
      const { getAllByRole, getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      ["Save", "Modify"].forEach((name) => {
        expect(getByRole("menuitem", { name: name })).toBeInTheDocument();
      });
      expect(getAllByRole("menuitem")).toHaveLength(2);
    });

    test("Save menuitem opens Save dialog", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Save" }));
      expect(getByRole("dialog", { name: "Save route" })).toBeInTheDocument();
    });

    test("Save dialog closes upon Discard, and not upon Escape", async () => {
      const { getByRole, queryByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Save" }));
      act(() => {
        fireEvent.keyDown(getByRole("dialog", { name: "Save route" }), { key: "Escape" });
      });
      await waitFor(() => {
        expect(getByRole("button", { name: "Discard" })).toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Discard" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog", { name: "Save route" })).not.toBeInTheDocument();
      });
    });

    test("Modify menuitem opens Modify dialog", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Modify" }));
      expect(getByRole("dialog", { name: "Modify route" })).toBeInTheDocument();
    });

    test("Modify dialog closes upon Hide", async () => {
      const { getByRole, queryByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Modify" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Hide dialog" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog", { name: "Modify route" })).not.toBeInTheDocument();
      });
    });

    test("Modify dialog closes upon Cancel", async () => {
      const { getByRole, queryByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Modify" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Cancel" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog", { name: "Modify route" })).not.toBeInTheDocument();
      });
    });

    test("Modify dialog closes upon Escape", async () => {
      const { getByRole, queryByRole } = render();
      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Modify" }));
      act(() => {
        fireEvent.keyDown(getByRole("dialog", { name: "Modify route" }), { key: "Escape" });
      });
      await waitFor(() => {
        expect(queryByRole("dialog", { name: "Modify route" })).not.toBeInTheDocument();
      });
    });

    it("should update `state` and `storage` upon Save", async () => {
      const storage = new InmemStorage();
      const { getByRole, getByText, queryByRole, store } = render({
        ...getState(),
        context: { ...context, storage: storage }
      });

      expect(store.getState().favorites.routes).toHaveLength(0);

      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Save" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Route A" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog", { name: "Save route" })).not.toBeInTheDocument();
      });

      expect(getByText("Route A")).toBeInTheDocument(); // alert is updated!
      expect(await storage.getRouteIdentifiers()).toHaveLength(1);
      expect(store.getState().favorites.routes).toHaveLength(1);
    });

    it("should not update `state` if `storage` fails on Save", async () => {
      const alert = jest.spyOn(window, "alert").mockImplementation();

      const storage = new InmemStorage();
      jest.spyOn(storage, "createRoute").mockImplementation(() => { throw new Error(); });

      const { getByRole, store } = render({
        ...getState(),
        context: {
          ...context,
          storage: storage
        }
      });

      expect(store.getState().favorites.routes).toHaveLength(0);

      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Save" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Route A" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });
      await waitFor(() => {
        expect(alert).toHaveBeenCalled();
        expect(getByRole("button", { name: "Save" })).not.toHaveAttribute("disabled");
      });

      expect(store.getState().favorites.routes).toHaveLength(0);
    });

    it("should update `state` upon Modify and `navigate`", async () => {
      const { getByRole, store } = render();

      expect(store.getState().searchDirecs.waypoints).toHaveLength(0);

      fireEvent.click(getByRole("button", { name: "Menu" }));
      fireEvent.click(getByRole("menuitem", { name: "Modify" }));
      fireEvent.click(getByRole("button", { name: "Confirm" }));

      expect(mockUseNavigate).toHaveBeenCalledWith("/search/direcs");
      expect(store.getState().searchDirecs.waypoints).toHaveLength(7);
    });
  });

  describe("map", () => {

    it("should draw stored and unstored waypoints", () => {
      const map = new LeafletMap();
      const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());
      const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());

      const { } = render({
        preloadedState: {
          ...getState().preloadedState,
          favorites: {
            ...initialFavoritesState(),
            places: [
              {
                ...getPlace(),
                name: "Place X",
                placeId: "2",
                smartId: "B"
              },
              {
                ...getPlace(),
                name: "Place Y",
                placeId: "4",
                smartId: "D"
              }
            ]
          }
        },
        context: { ...context, map: map }
      });

      expect(addStored).toHaveBeenCalledTimes(2);
      expect(addCommon).toHaveBeenCalledTimes(2);
    });

    it("should refresh map for every route", () => {
      const map = new LeafletMap();
      const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
      const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
      const addSource = jest.spyOn(map, "addSource").mockImplementation(jest.fn());
      const addTarget = jest.spyOn(map, "addTarget").mockImplementation(jest.fn());
      const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
      const drawPolyline = jest.spyOn(map, "drawPolyline").mockImplementation(jest.fn());
  
      const { getByRole } = render({
        ...getState(),
        context: { ...context, map: map }
      });
  
      [
        [clear, 1],
        [flyTo, 0], // no fly!
        [addSource, 1],
        [addTarget, 1],
        [addCommon, 4], // repeated waypoints are drawn only once!
        [drawPolyline, 1]
      ].forEach(([spy, times]) => { expect(spy).toHaveBeenCalledTimes(times as number); });
  
      fireEvent.click(getByRole("button", { name: "Go to page 2" }));
  
      [
        [clear, 2],
        [flyTo, 0], // !
        [addSource, 2],
        [addTarget, 2],
        [addCommon, 8], // !
        [drawPolyline, 2]
      ].forEach(([spy, times]) => { expect(spy).toHaveBeenCalledTimes(times as number); });
    });
  });
});
