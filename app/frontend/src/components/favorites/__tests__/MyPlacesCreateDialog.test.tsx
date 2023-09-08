import { act, fireEvent } from "@testing-library/react";
import { context } from "../../../features/context";
import { LeafletMap } from "../../../utils/leaflet";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import MyPlacesCreateDialog from "../MyPlacesCreateDialog";
import { initialFavoritesState } from "../../../features/favoritesSlice";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<MyPlacesCreateDialog />, options);
}

describe("<MyPlacesCreateDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeInTheDocument();
  });

  test("add location", () => {
    const map = new LeafletMap();
    const ctx = {
      ...context,
      map: map
    };
    const clr = jest.fn();
    jest.spyOn(map, "clear").mockImplementation(clr);
    jest.spyOn(map, "captureLocation").mockImplementation(
      (callback) => callback({ lon: 0.1, lat: 0.2 })
    );
    const spy = jest.spyOn(map, "addCommon");

    const { getByRole, getByText } = render({
      context: ctx
    });
    fireEvent.click(getByRole("button", { name: "Select location" }));

    expect(clr).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(getByText("0.200000N, 0.100000E")).toBeInTheDocument();
  });

  test("delete location", () => {
    const { getByRole, getByText } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          location: { lon: 1.0, lat: 2.0 }
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "Remove point" }));
    expect(getByText("Select location...")).toBeInTheDocument();
  });

  test("enter name", () => {
    const v = "Medieval castle";
    const { getByRole } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          createExpanded: true
        }
      }
    });
    fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: v } });
    expect(getByRole("textbox", { name: "Name" })).toHaveValue(v);
  });

  test("clear all", () => {
    const { getByRole, getByText } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          name: "Medieval castle",
          location: { lon: 1.0, lat: 2.0 }
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "Clear" }));
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("");
    expect(getByText("Select location...")).toBeInTheDocument();
  });

  test("create place", async () => {
    const { store, getByRole, getByText } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          name: "Medieval castle",
          location: { lon: 1.0, lat: 2.0 }
        }
      }
    });
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Create" }));
    });
    expect(store.getState().favorites.places.length).toBe(1);
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("")
    expect(getByText("Select location...")).toBeInTheDocument();
  });

  test("prevent empty name", () => {
    const { getByRole } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          name: "     ",
          location: { lon: 1.0, lat: 2.0 }
        }
      }
    });
    expect(getByRole("button", { name: "Create" })).toHaveAttribute("disabled");
  })
});
