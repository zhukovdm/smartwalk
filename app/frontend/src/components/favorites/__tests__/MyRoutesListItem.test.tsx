import { act, fireEvent, waitFor } from "@testing-library/react";
import { StoredPlace } from "../../../domain/types";
import { context } from "../../../features/context";
import InmemStorage from "../../../utils/inmemStorage";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace, getRoute } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders,
} from "../../../utils/testUtils";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyRoutesListItem, { type MyRoutesListItemProps } from "../MyRoutesListItem";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

const getDefault = (): MyRoutesListItemProps => ({
  index: 1,
  route: {
    ...getRoute(),
    routeId: "1",
    name: "Route A"
  },
  storedPlaces: new Map<string, StoredPlace>([
    [
      "1",
      {
        ...getPlace(),
        name: "Starting point", // !
        placeId: "1"
      }
    ]
  ]),
  storedSmarts: new Map<string, StoredPlace>([
    [
      "C",
      {
        ...getPlace(),
        name: "Street market", // !
        placeId: "4",
        smartId: "C"
      }
    ]
  ])
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<MyRoutesListItem {...props} />, options);
}

describe("<MyRoutesListItem />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("Route button draws route (with merge)", () => {
    const map = new LeafletMap();
    const ctx = {
      ...context,
      map: map,
      storage: new InmemStorage()
    };

    const [
      clear,
      addStored,
      addCommon,
      addSource,
      addTarget,
      drawPolyline,
      flyTo
    ] = Array(7).fill(undefined).map(() => jest.fn());

    jest.spyOn(map, "clear").mockImplementation(clear);
    jest.spyOn(map, "addStored").mockImplementation(addStored);
    jest.spyOn(map, "addCommon").mockImplementation(addCommon);
    jest.spyOn(map, "addSource").mockImplementation(addSource);
    jest.spyOn(map, "addTarget").mockImplementation(addTarget);
    jest.spyOn(map, "drawPolyline").mockImplementation(drawPolyline);
    jest.spyOn(map, "flyTo").mockImplementation(flyTo);

    const { getByRole } = render(getDefault(), { context: ctx });
    fireEvent.click(getByRole("button", { name: "Draw route" }));

    expect(clear).toHaveBeenCalled();

    const mergedStored = {
      ...getPlace(),
      name: "Street market",
      placeId: "4",
      smartId: "C",
      categories: [3]
    };
    expect(addStored).toHaveBeenCalledWith(
      mergedStored, getDefault().route.categories);

    const mergedSource = {
      ...getPlace(),
      name: "Starting point",
      placeId: "1"
    };
    expect(addSource).toHaveBeenCalledWith(
      mergedSource, [], false);

    expect(addCommon).toHaveBeenCalledTimes(3);
    expect(addTarget).toHaveBeenCalled();
    expect(drawPolyline).toHaveBeenCalled();
    expect(flyTo).toHaveBeenCalled();
  });

  test("View sets route and redirect", () => {
    const r = getDefault();

    const { store, getByRole } = render(r);
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "View" }));

    expect(mockUseNavigate).toHaveBeenCalledWith("/viewer/route");
    expect(store.getState().viewer.route).toBe(r.route);
  });

  test("Edit updates storage and state", async () => {
    const storage = new InmemStorage();
    const ctx = {
      ...context,
      storage: storage
    };

    const { store, getByRole } = render(getDefault(), { context: ctx });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    fireEvent.change(getByRole("textbox"), { target: { value: "Route B" } });

    // multiple update ~> fails without async!
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });

    await waitFor(() => {
      expect(store.getState().favorites.routes[1]?.name === "Route B");
      expect(storage.getRoute("1")).toBeTruthy();
    });
  });

  test("name in Edit dialog gets updated upon Save", async () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    fireEvent.change(getByRole("textbox"), { target: { value: "Route B" } });
    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(getByRole("button", { name: "Menu" })).toBeInTheDocument();
    }, { timeout: 2000 });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("Route B");
  });

  test("Modify replace direction sequence and redirects", () => {

    /**
     * Specifically, the place with `smartId` equal to "A" is passed TWO times.
     * This is the correct behavior and enables filtering points by category.
     */

    const { store, getByRole } = render(getDefault(), {
      preloadedState: {
        searchDirecs: {
          waypoints: [
            {
              ...getPlace(),
              name: "Place X",
            }
          ]
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Modify" }));
    fireEvent.click(getByRole("button", { name: "Confirm" }));

    expect(store.getState().searchDirecs.waypoints.length).toBe(7);
    expect(mockUseNavigate).toHaveBeenCalledWith("/search/direcs");
  });

  test("Delete removes route from storage and state", async () => {
    const N = 5;
    const f = jest.fn();
    const storage = new InmemStorage();
    jest.spyOn(storage, "deleteRoute").mockImplementation(f);
    const ctx = {
      ...context,
      storage: storage
    };

    const { store, getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          routes: Array(N).fill(undefined).map(() => ({
            ...getRoute(),
            routeId: "1"
          }))
        }
      },
      context: ctx
    });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Delete" }));
    act(() => {
      fireEvent.click(getByRole("button", { name: "Delete" }));
    });

    await waitFor(() => {
      expect(store.getState().favorites.routes.length).toBe(N - 1);
      expect(f).toHaveBeenCalledTimes(1);
    });
  });
});
