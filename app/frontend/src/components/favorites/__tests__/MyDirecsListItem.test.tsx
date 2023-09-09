import {
  act,
  fireEvent,
  waitFor
} from "@testing-library/react";
import type { StoredPlace } from "../../../domain/types";
import { getPlace, getDirec } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders,
} from "../../../utils/testUtils";
import { LeafletMap } from "../../../utils/leaflet";
import InmemStorage from "../../../utils/inmemStorage";
import { context } from "../../../features/context";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyDirecsListItem, {
  type MyDirecsListItemProps
} from "../MyDirecsListItem";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

const getDefault = (): MyDirecsListItemProps => ({
  index: 1,
  direc: {
    ...getDirec(),
    direcId: "1",
    name: "Direction A",
  },
  storedPlaces: new Map<string, StoredPlace>([
    [
      "2",
      {
        ...getPlace(),
        placeId: "2",
        name: "Place X" // !
      }
    ]
  ]),
  storedSmarts: new Map<string, StoredPlace>([
    [
      "D",
      {
        ...getPlace(),
        placeId: "4",
        smartId: "D",
        name: "Place Y", // !
      }
    ]
  ])
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
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

    const [
      clear,
      addStored,
      addCommon,
      drawPolyline,
      flyTo
    ] = Array(5).fill(undefined).map(() => jest.fn());

    jest.spyOn(map, "clear").mockImplementation(clear);
    jest.spyOn(map, "addStored").mockImplementation(addStored);
    jest.spyOn(map, "addCommon").mockImplementation(addCommon);
    jest.spyOn(map, "drawPolyline").mockImplementation(drawPolyline);
    jest.spyOn(map, "flyTo").mockImplementation(flyTo);

    const { getByRole } = render(getDefault(), { context: ctx });
    fireEvent.click(getByRole("button", { name: "Draw direction" }));

    expect(clear).toHaveBeenCalled();
    expect(addStored).toHaveBeenCalledTimes(2);
    expect(addCommon).toHaveBeenCalledTimes(3);
    expect(drawPolyline).toHaveBeenCalled();
    expect(flyTo).toHaveBeenCalled();
  });

  test("View sets direction and redirect", () => {
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
      expect(store.getState().favorites.direcs[1]?.name === "Direction B");
      expect(storage.getDirec("1")).toBeTruthy();
    });
  });

  test("name in Edit dialog gets updated upon Save", async () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    fireEvent.change(getByRole("textbox"), { target: { value: "Direction B" } });
    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(getByRole("button", { name: "Menu" })).toBeInTheDocument();
    }, { timeout: 2000 });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("Direction B");
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
          direcs: Array(5).fill(undefined).map(() => ({
            ...getDirec(),
            direcId: "1"
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
      expect(store.getState().favorites.direcs.length).toBe(4);
      expect(f).toHaveBeenCalledTimes(1);
    });
  });
});
