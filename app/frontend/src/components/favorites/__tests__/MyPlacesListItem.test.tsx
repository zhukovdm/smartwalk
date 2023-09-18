import {
  act,
  fireEvent,
  waitFor
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import InmemStorage from "../../../utils/inmemStorage";
import { getPlace } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders,
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyPlacesListItem, {
  type MyPlacesListItemProps
} from "../MyPlacesListItem";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

const getProps = (): MyPlacesListItemProps => ({
  index: 1,
  place: {
    ...getPlace(),
    placeId: "1",
    name: "Place A"
  }
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<MyPlacesListItem {...props} />, options);
}

describe("<MyPlacesListItem />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("Place button draws place", () => {
    const map = new LeafletMap();
    const ctx = {
      ...context,
      map: map,
      storage: new InmemStorage()
    };

    const [clr, ads, fly] = Array(3)
      .fill(undefined).map(() => jest.fn());

    jest.spyOn(map, "clear").mockImplementation(clr);
    jest.spyOn(map, "addStored").mockImplementation(ads);
    jest.spyOn(map, "flyTo").mockImplementation(fly);

    const { getByRole } = render(getProps(), { context: ctx });
    fireEvent.click(getByRole("button", { name: "Draw place" }));

    expect(clr).toHaveBeenCalled();
    expect(ads).toHaveBeenCalled();
    expect(fly).toHaveBeenCalled();
  });

  test("View sets place and redirect", () => {
    const p = getProps();

    const { store, getByRole } = render(p);
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "View" }));

    expect(mockUseNavigate).toHaveBeenCalledWith("/viewer/place");
    expect(store.getState().viewer.place).toBe(p.place);
  });

  test("Edit updates `storage` and `state`", async () => {
    const storage = new InmemStorage();

    const { store, getByRole } = render(getProps(), {
      context: {
        ...context,
        storage: storage
      }
    });

    expect(store.getState().favorites.places).toHaveLength(0);

    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    fireEvent.change(getByRole("textbox"), { target: { value: "Place B" } });

    // multiple update ~> fails without async!
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });

    await waitFor(() => {
      expect(store.getState().favorites.places[1]?.name === "Place B");
    });

    expect(await storage.getPlace("1")).toBeTruthy();
    expect(store.getState().favorites.places).toHaveLength(1);
  });

  it("should not update `state` if `storage` fails on Save", async () => {
    const alert = jest.spyOn(window, "alert").mockImplementation();

    const storage = new InmemStorage();
    jest.spyOn(storage, "updatePlace").mockImplementation(() => { throw new Error(); });

    const { store, getByRole } = render(getProps(), {
      context: {
        ...context,
        storage: storage
      }
    });

    expect(store.getState().favorites.places).toHaveLength(0);

    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    fireEvent.change(getByRole("textbox"), { target: { value: "Place B" } });

    // multiple update ~> fails without async!
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });

    await waitFor(() => {
      expect(alert).toHaveBeenCalled();
      expect(getByRole("button", { name: "Save" })).not.toHaveAttribute("disabled");
    });

    expect(store.getState().favorites.places).toHaveLength(0);
  });

  test("name in Edit dialog gets updated upon Save", async () => {

    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    fireEvent.change(getByRole("textbox"), { target: { value: "Place B" } });
    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(getByRole("button", { name: "Menu" })).toBeInTheDocument();
    }, { timeout: 2000 });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place B");
  });

  test("Append extends current direction sequence by a place", () => {

    const { store, getByRole } = render(getProps(), {
      preloadedState: {
        searchDirecs: {
          waypoints: [
            {
              name: "Place X",
              keywords: [],
              location: { lon: 0.0, lat: 0.0 },
              categories: []
            }
          ]
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Append" }));
    fireEvent.click(getByRole("button", { name: "Confirm" }));

    expect(store.getState().searchDirecs.waypoints.length).toBe(2);
  });

  test("Delete removes place from storage and state", async () => {
    const f = jest.fn();
    const storage = new InmemStorage();
    jest.spyOn(storage, "deletePlace").mockImplementation(f);
    const ctx = {
      ...context,
      storage: storage
    };

    const { store, getByRole } = render(getProps(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: Array(5).fill(undefined).map(() => ({
            ...getPlace(),
            placeId: "1"
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
      expect(store.getState().favorites.places.length).toBe(4);
      expect(f).toHaveBeenCalledTimes(1);
    });
  });
});
