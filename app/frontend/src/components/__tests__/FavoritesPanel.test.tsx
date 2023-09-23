import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import {
  getDirec,
  getPlace,
  getRoute
} from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import InmemStorage from "../../utils/inmemStorage";
import { context } from "../../features/context";
import { initialFavoritesState } from "../../features/favoritesSlice";
import FavoritesPanel, {
  type FavoritesPanelProps
} from "../FavoritesPanel";

global.alert = jest.fn();

const getProps = (): FavoritesPanelProps => ({
  loaded: true,
  loadedRatio: 0.5
});

const getOptions = (): AppRenderOptions => {
  const tokens = [["A", "1"], ["B", "2"], ["C", "3"]];
  return {
    preloadedState: {
      favorites: {
        ...initialFavoritesState(),
        direcs: tokens.map(([nameId, direcId]) => ({ ...getDirec(), name: `Direc ${nameId}`, direcId })),
        places: tokens.map(([nameId, placeId]) => ({ ...getPlace(), name: `Place ${nameId}`, placeId })),
        routes: tokens.map(([nameId, routeId]) => ({ ...getRoute(), name: `Route ${nameId}`, routeId }))
      }
    }
  };
};

function render(props = getProps(), options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<FavoritesPanel {...props} />, options);
}

describe("<FavoritesPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should render stub if loading is not finished", () => {
    const { getByText } = render({ ...getProps(), loaded: false });
    expect(getByText("50%")).toBeInTheDocument();
  });

  it("should render empty panel", () => {
    const { getByRole } = render(getProps(), {});
    expect(getByRole("alert")).toBeInTheDocument();

    expect(within(getByRole("region", { name: "My Directions" }))
      .getByRole("button", { name: "Search directions" })).toBeInTheDocument();

    expect(within(getByRole("region", { name: "My Places" }))
      .getByRole("button", { name: "Search places" })).toBeInTheDocument();

    expect(within(getByRole("region", { name: "My Routes" }))
      .getByRole("button", { name: "Search routes" })).toBeInTheDocument();
  });

  it("should render panel with items of all kinds", () => {
    const { getByRole } = render();
    expect(getByRole("listitem", { name: "Direc A" })).toBeInTheDocument();
    expect(getByRole("listitem", { name: "Place B" })).toBeInTheDocument();
    expect(getByRole("listitem", { name: "Route C" })).toBeInTheDocument();
  });

  describe("direc", () => {

    /**
     * `View` and `Modify` are tested in the PanelDrawer.test.tsx.
     */
    ///

    it("should edit name and sort items by name", async () => {
      const storage = new InmemStorage();

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });

      const region = getByRole("region", { name: "My Directions" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Direc B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Edit" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Direc D" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      expect(await storage.getDirecIdentifiers()).toEqual(["2"]);

      const direcs = within(region).queryAllByRole("listitem");

      ["A", "C", "D"].forEach((suffix, i) => {
        expect(within(direcs[i]).getByText(`Direc ${suffix}`)).toBeInTheDocument();
      });
      expect(direcs).toHaveLength(3);
    });

    it("should left an item intact if storage fails to update it", async () => {
      const storage = new InmemStorage();
      jest.spyOn(storage, "updateDirec").mockRejectedValueOnce(new Error());

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });

      const region = getByRole("region", { name: "My Directions" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Direc B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Edit" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Direc D" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(getByRole("button", { name: "Save" })).toBeEnabled();
      });

      fireEvent.click(getByRole("button", { name: "Discard" }));

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      })

      const direcs = within(region).queryAllByRole("listitem");

      ["A", "B", "C"].forEach((suffix, i) => {
        expect(within(direcs[i]).getByText(`Direc ${suffix}`)).toBeInTheDocument();
      });
      expect(direcs).toHaveLength(3);
    }, 10000);

    it("should allow the user to delete an item", async () => {
      const { getByRole, queryByRole } = render();
      const region = getByRole("region", { name: "My Directions" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Direc B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Delete" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      const direcs = within(region).queryAllByRole("listitem");

      ["A", "C"].forEach((suffix, i) => {
        expect(within(direcs[i]).getByText(`Direc ${suffix}`)).toBeInTheDocument();
      });
      expect(direcs).toHaveLength(2);
    });

    it("should left an item intact if storage fails to delete it", async () => {
      const storage = new InmemStorage();
      jest.spyOn(storage, "deleteDirec").mockRejectedValueOnce(new Error());

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });
      const region = getByRole("region", { name: "My Directions" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Direc B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Delete" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });

      await waitFor(() => {
        expect(getByRole("button", { name: "Delete" })).toBeEnabled();
      });

      fireEvent.click(getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      const direcs = within(region).queryAllByRole("listitem");

      ["A", "B", "C"].forEach((suffix, i) => {
        expect(within(direcs[i]).getByText(`Direc ${suffix}`)).toBeInTheDocument();
      });
      expect(direcs).toHaveLength(3);
    }, 10000);
  });

  describe("place", () => {

    /**
     * `View`, `Append`, `Create` and `Menu state` are tested in the
     * PanelDrawer.test.tsx.
     */
    ///

    it("should edit name and sort items by name", async () => {
      const storage = new InmemStorage();

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });

      const region = getByRole("region", { name: "My Places" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Edit" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      expect(await storage.getPlaceIdentifiers()).toEqual(["2"]);

      const places = within(region).queryAllByRole("listitem");

      ["A", "C", "D"].forEach((suffix, i) => {
        expect(within(places[i]).getByText(`Place ${suffix}`)).toBeInTheDocument();
      });
      expect(places).toHaveLength(3);
    });

    it("should left an item intact if storage fails to update it", async () => {
      const storage = new InmemStorage();
      jest.spyOn(storage, "updatePlace").mockRejectedValueOnce(new Error());

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });

      const region = getByRole("region", { name: "My Places" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Edit" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(getByRole("button", { name: "Save" })).toBeEnabled();
      });

      fireEvent.click(getByRole("button", { name: "Discard" }));

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      })

      const places = within(region).queryAllByRole("listitem");

      ["A", "B", "C"].forEach((suffix, i) => {
        expect(within(places[i]).getByText(`Place ${suffix}`)).toBeInTheDocument();
      });
      expect(places).toHaveLength(3);
    }, 10000);

    it("should allow the user to delete an item", async () => {
      const { getByRole, queryByRole } = render();
      const region = getByRole("region", { name: "My Places" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Delete" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      const places = within(region).queryAllByRole("listitem");

      ["A", "C"].forEach((suffix, i) => {
        expect(within(places[i]).getByText(`Place ${suffix}`)).toBeInTheDocument();
      });
      expect(places).toHaveLength(2);
    });

    it("should left an item intact if storage fails to delete it", async () => {
      const storage = new InmemStorage();
      jest.spyOn(storage, "deletePlace").mockRejectedValueOnce(new Error());

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });
      const region = getByRole("region", { name: "My Places" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Delete" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });

      await waitFor(() => {
        expect(getByRole("button", { name: "Delete" })).toBeEnabled();
      });

      fireEvent.click(getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      const places = within(region).queryAllByRole("listitem");

      ["A", "B", "C"].forEach((suffix, i) => {
        expect(within(places[i]).getByText(`Place ${suffix}`)).toBeInTheDocument();
      });
      expect(places).toHaveLength(3);
    }, 10000);

    describe("user-defined place", () => {

      it("should disable Create button if a location is missing", () => {

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            favorites: {
              ...initialFavoritesState(),
              loaded: true,
              createExpanded: true,
              name: "Place A"
            }
          }
        });

        expect(getByText("Select location...")).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place A");
        expect(getByRole("button", { name: "Create" })).toBeDisabled();
      });

      it("should disable Create button if a name is missing or whitespaced", () => {

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            favorites: {
              ...initialFavoritesState(),
              loaded: true,
              createExpanded: true,
              location: {
                lon: 0.0,
                lat: 0.0
              }
            }
          }
        });

        const textbox = getByRole("textbox", { name: "Name" });

        expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();
        expect(textbox).toHaveValue("");
        expect(getByRole("button", { name: "Create" })).toBeDisabled();

        fireEvent.change(textbox, { target: { value: " \t " } });
        expect(getByRole("button", { name: "Create" })).toBeDisabled();
      });

      it("should enable Create button if both location and name are defined", () => {

        const { getByRole } = render(getProps(), {
          preloadedState: {
            favorites: {
              ...initialFavoritesState(),
              loaded: true,
              createExpanded: true,
              location: {
                lon: 0.0,
                lat: 0.0
              },
              name: "Place A"
            }
          }
        });

        expect(getByRole("button", { name: "Create" })).toBeEnabled();
      });

      test("Remove button removes only location", () => {

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            favorites: {
              ...initialFavoritesState(),
              loaded: true,
              createExpanded: true,
              location: {
                lon: 0.0,
                lat: 0.0
              },
              name: "Place A"
            }
          }
        });
  
        expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place A");
  
        fireEvent.click(getByRole("button", { name: "Remove point" }));
  
        expect(getByText("Select location...")).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place A");
      });
  
      test("Clear button removes both location and name", () => {
  
        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            favorites: {
              ...initialFavoritesState(),
              loaded: true,
              createExpanded: true,
              location: {
                lon: 0.0,
                lat: 0.0
              },
              name: "Place A"
            }
          }
        });
  
        expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place A");
  
        fireEvent.click(getByRole("button", { name: "Clear" }));
  
        expect(getByText("Select location...")).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Name" })).toHaveValue("");
      });
    });
  });

  describe("route", () => {

    /**
     * View and Modify are tested in the PanelDrawer.test.tsx.
     */
    ///

    it("should edit name and sort items by name", async () => {
      const storage = new InmemStorage();

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });

      const region = getByRole("region", { name: "My Routes" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Route B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Edit" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Route D" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      expect(await storage.getRouteIdentifiers()).toEqual(["2"]);

      const routes = within(region).queryAllByRole("listitem");

      ["A", "C", "D"].forEach((suffix, i) => {
        expect(within(routes[i]).getByText(`Route ${suffix}`)).toBeInTheDocument();
      });
      expect(routes).toHaveLength(3);
    });

    it("should left an item intact if storage fails to update it", async () => {
      const storage = new InmemStorage();
      jest.spyOn(storage, "updateRoute").mockRejectedValueOnce(new Error());

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });

      const region = getByRole("region", { name: "My Routes" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Route B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Edit" }));
      fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Route D" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Save" }));
      });

      await waitFor(() => {
        expect(getByRole("button", { name: "Save" })).toBeEnabled();
      });

      fireEvent.click(getByRole("button", { name: "Discard" }));

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      })

      const routes = within(region).queryAllByRole("listitem");

      ["A", "B", "C"].forEach((suffix, i) => {
        expect(within(routes[i]).getByText(`Route ${suffix}`)).toBeInTheDocument();
      });
      expect(routes).toHaveLength(3);
    }, 10000);

    it("should allow the user to delete an item", async () => {
      const { getByRole, queryByRole } = render();
      const region = getByRole("region", { name: "My Routes" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Route B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Delete" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      const routes = within(region).queryAllByRole("listitem");

      ["A", "C"].forEach((suffix, i) => {
        expect(within(routes[i]).getByText(`Route ${suffix}`)).toBeInTheDocument();
      });
      expect(routes).toHaveLength(2);
    });

    it("should left an item intact if storage fails to delete it", async () => {
      const storage = new InmemStorage();
      jest.spyOn(storage, "deleteRoute").mockRejectedValueOnce(new Error());

      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        context: { ...context, storage }
      });
      const region = getByRole("region", { name: "My Routes" });

      fireEvent.click(within(within(region).getByRole("listitem", { name: "Route B" })).getByRole("button", { name: "Menu" }));

      fireEvent.click(getByRole("menuitem", { name: "Delete" }));
      act(() => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });

      await waitFor(() => {
        expect(getByRole("button", { name: "Delete" })).toBeEnabled();
      });

      fireEvent.click(getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      const routes = within(region).queryAllByRole("listitem");

      ["A", "B", "C"].forEach((suffix, i) => {
        expect(within(routes[i]).getByText(`Route ${suffix}`)).toBeInTheDocument();
      });
      expect(routes).toHaveLength(3);
    }, 10000);
  });
});
