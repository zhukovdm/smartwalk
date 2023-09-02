import {
  act,
  fireEvent,
  waitFor
} from "@testing-library/react";
import { StoredDirec, StoredPlace } from "../../../domain/types";
import {
  StoreRenderOptions,
  renderWithProviders,
} from "../../../utils/testUtils";
import { LeafletMap } from "../../../utils/leaflet";
import InmemStorage from "../../../utils/inmemStorage";
import { context } from "../../../features/context";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyDirecsListItem, { MyDirecsListItemProps } from "../MyDirecsListItem";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

const getDefault = (): MyDirecsListItemProps => ({
  index: 3,
  direc: {
    direcId: "1",
    name: "Direction A",
    path: {
      distance: 1.2,
      duration: 350,
      polyline: [
        { lon: 0.0, lat: 0.0 },
        { lon: 1.0, lat: 1.0 },
        { lon: 2.0, lat: 2.0 },
        { lon: 3.0, lat: 3.0 },
        { lon: 4.0, lat: 4.0 },
        { lon: 5.0, lat: 5.0 },
        { lon: 6.0, lat: 6.0 },
        { lon: 7.0, lat: 7.0 },
        { lon: 8.0, lat: 8.0 },
        { lon: 9.0, lat: 9.0 }
      ]
    },
    waypoints: [
      // location-based (no Id)
      {
        name: "Place A",
        keywords: ["a"],
        location: { lon: 0.0, lat: 0.0 },
        categories: []
      },
      // stored
      {
        placeId: "2",
        name: "Place B",
        keywords: ["b"],
        location: { lon: 2.0, lat: 2.0 },
        categories: []
      },
      // deleted
      {
        placeId: "3",
        name: "Place C",
        keywords: ["c"],
        location: { lon: 4.0, lat: 4.0 },
        categories: []
      },
      // stored
      {
        smartId: "D",
        name: "Place D",
        keywords: ["d"],
        location: { lon: 6.0, lat: 6.0 },
        categories: []
      },
      // unknown
      {
        smartId: "E",
        name: "Place E",
        keywords: ["e"],
        location: { lon: 8.0, lat: 8.0 },
        categories: []
      },
    ]
  },
  storedPlaces: new Map<string, StoredPlace>([
    [
      "2",
      {
        placeId: "2",
        name: "Place X", // !
        keywords: ["b"],
        location: { lon: 2.0, lat: 2.0 },
        categories: []
      }
    ]
  ]),
  storedSmarts: new Map<string, StoredPlace>([
    [
      "D",
      {
        placeId: "4",
        smartId: "D",
        name: "Place Y", // !
        keywords: ["d"],
        location: { lon: 6.0, lat: 6.0 },
        categories: []
      }
    ]
  ])
});

const getStoredDirec = (): StoredDirec => ({
  direcId: "1",
  name: "Direction",
  path: {
    distance: 0.0,
    duration: 0.0,
    polyline: []
  },
  waypoints: []
});

function render(props = getDefault(), options: StoreRenderOptions = {}) {
  return renderWithProviders(<MyDirecsListItem {...props} />, options);
}

describe("<MyDirecsListItem />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("Direc button draws direction", () => {
    const map = new LeafletMap();
    const ctx = {
      ...context,
      map: map,
      storage: new InmemStorage()
    };

    const [clr, ads, adc, pol, fly] = Array(5)
      .fill(undefined).map(() => jest.fn());

    jest.spyOn(map, "clear").mockImplementation(clr);
    jest.spyOn(map, "addStored").mockImplementation(ads);
    jest.spyOn(map, "addCommon").mockImplementation(adc);
    jest.spyOn(map, "drawPolyline").mockImplementation(pol);
    jest.spyOn(map, "flyTo").mockImplementation(fly);

    const { getByRole } = render(getDefault(), { context: ctx });
    fireEvent.click(getByRole("button", { name: "Draw direction" }));

    expect(clr).toHaveBeenCalled();
    expect(ads).toHaveBeenCalledTimes(2);
    expect(adc).toHaveBeenCalledTimes(3);
    expect(pol).toHaveBeenCalled();
    expect(fly).toHaveBeenCalled();
  });

  test("View set direction and redirect", () => {
    const d = getDefault();

    const { store, getByRole } = render(d);
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "View" }));

    expect(mockUseNavigate).toHaveBeenCalledWith("/viewer/direc");
    expect(store.getState().viewer.direc).toBe(d.direc);
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
    fireEvent.change(getByRole("textbox"), { target: { value: "Direction B" } });

    // multiple update ~> fails without async!
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });

    await waitFor(() => {
      expect(store.getState().favorites.direcs[3]?.name === "Direction B");
      expect(storage.getDirec("1")).toBeTruthy();
    });
  });

  test("Modify replace direction sequence and redirects", () => {

    const { store, getByRole } = render(getDefault(), {
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
    fireEvent.click(getByRole("menuitem", { name: "Modify" }));
    fireEvent.click(getByRole("button", { name: "Confirm" }));

    expect(store.getState().searchDirecs.waypoints.length).toBe(5);
    expect(mockUseNavigate).toHaveBeenCalledWith("/search/direcs");
  });

  test("Delete removes direc from storage and state", async () => {
    const f = jest.fn();
    const storage = new InmemStorage();
    jest.spyOn(storage, "deleteDirec").mockImplementation(f);
    const ctx = {
      ...context,
      storage: storage
    };

    const { store, getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          direcs: Array(5).fill(undefined).map(() => getStoredDirec())
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
      expect(store.getState().favorites.direcs.length).toBe(4);
      expect(f).toHaveBeenCalledTimes(1);
    });
  });
});
