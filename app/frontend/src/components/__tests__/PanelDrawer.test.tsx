import { act, fireEvent, waitFor, within } from "@testing-library/react";
import type {
  PlacesRequest,
  RoutesRequest,
  UiPlace
} from "../../domain/types";
import {
  getDirec,
  getExtendedPlace,
  getKeywordAdviceItem,
  getPath,
  getPlace,
  getRoute,
} from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import * as smartwalkApi from "../../utils/smartwalk";
import InmemStorage from "../../utils/inmemStorage";
import { LeafletMap } from "../../utils/leaflet";
import { context } from "../../features/context";
import { initialPanelState } from "../../features/panelSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";
import { initialResultDirecsState } from "../../features/resultDirecsSlice";
import { initialSearchDirecsState } from "../../features/searchDirecsSlice";
import { type SearchPlacesState } from "../../features/searchPlacesSlice";
import { type SearchRoutesState } from "../../features/searchRoutesSlice";
import PanelDrawer from "../PanelDrawer";

global.alert = jest.fn();

const getProps = (): {} => ({});

const getOptions = (): AppRenderOptions => {
  const tokens = [["A", "1"], ["B", "2"], ["C", "3"]];
  return {
    preloadedState: {
      panel: {
        ...initialPanelState(),
        show: true
      },
      favorites: {
        ...initialFavoritesState(),
        loaded: true,
        direcs: tokens.map(([nameId, direcId]) => ({ ...getDirec(), name: `Direc ${nameId}`, direcId })),
        places: tokens.map(([nameId, placeId]) => ({ ...getPlace(), name: `Place ${nameId}`, placeId })),
        routes: tokens.map(([nameId, routeId]) => ({ ...getRoute(), name: `Route ${nameId}`, routeId }))
      }
    }
  }
};

function render(props = getProps(), options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<PanelDrawer {...props} />, options);
}

describe("<PanelDrawer />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("favorites", () => {

    const getFavoritesOptions = (): AppRenderOptions => ({
      ...getOptions(),
      routerProps: {
        initialEntries: ["/favorites"]
      }
    });

    describe("direcs", () => {

      it("should allow the user to view direcs and navigate back", () => {

        const { getByRole, getByText } = render(getProps(), getFavoritesOptions());

        ["A", "B", "C"].forEach((handle) => {
          fireEvent.click(within(getByRole("listitem", { name: `Direc ${handle}` })).getByRole("button", { name: "Menu" }));
          fireEvent.click(getByRole("menuitem", { name: "View" }));

          expect(getByText(`Direc ${handle}`)).toBeInTheDocument();
          expect(getByText("Walking distance", { exact: false })).toBeInTheDocument();

          fireEvent.click(getByRole("button", { name: "Back" }));
          expect(getByRole("button", { name: "My Directions" })).toBeInTheDocument();
        });
      });

      it("should replace current sequence by points of a direc ordered for modification", async () => {

        const { getByRole, queryAllByRole } = render(getProps(), {
          ...getFavoritesOptions(),
          preloadedState: {
            ...getFavoritesOptions().preloadedState,
            searchDirecs: {
              waypoints: [
                { ...getPlace(), name: "Place Y" }
              ]
            }
          }
        });

        fireEvent.click(within(getByRole("listitem", { name: "Direc B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Modify" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));

        await waitFor(() => {
          expect(within(getByRole("list", { name: "Waypoints" })).queryAllByRole("listitem")).not.toHaveLength(0);
        });
        const places = queryAllByRole("listitem");

        ["A", "B", "C", "D", "E"].forEach((handle, i) => {
          expect(within(places[i]).getByText(`Place ${handle}`)).toBeInTheDocument();
        });
        expect(places).toHaveLength(5);
      });
    });

    describe("places", () => {

      it("should allow the user to view places and navigate back", () => {
        const { getByRole, getByText } = render(getProps(), getFavoritesOptions());
  
        ["A", "B", "C"].forEach((handle) => {
          fireEvent.click(within(getByRole("listitem", { name: `Place ${handle}` })).getByRole("button", { name: "Menu" }));
          fireEvent.click(getByRole("menuitem", { name: "View" }));

          expect(getByText(`Place ${handle}`)).toBeInTheDocument();
          expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();

          fireEvent.click(getByRole("button", { name: "Back" }));
          expect(getByRole("button", { name: "My Places" })).toBeInTheDocument();
        });
      });
  
      it("should append a place to the current direction sequence", async () => {

        const { getByRole, queryAllByRole, queryByRole } = render(getProps(), {
          ...getFavoritesOptions(),
          preloadedState: {
            ...getFavoritesOptions().preloadedState,
            searchDirecs: {
              waypoints: [
                { ...getPlace(), name: "Place Y" }
              ]
            }
          }
        });

        fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Append" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
  
        await waitFor(() => {
          expect(queryByRole("dialog")).not.toBeInTheDocument();
        });
  
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Search directions" }));
  
        await waitFor(() => {
          expect(queryAllByRole("listitem")).not.toHaveLength(0);
        });
        const places = queryAllByRole("listitem");
  
        ["Y", "B"].forEach((handle, i) => {
          expect(within(places[i]).getByText(`Place ${handle}`)).toBeInTheDocument();
        });
      });
  
      it("should allow the user to create a user-defined place", async () => {
        const map = new LeafletMap();
        const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();
  
        const storage = new InmemStorage();
  
        const { getByRole, getByText, queryByRole } = render(getProps(), {
          ...getFavoritesOptions(),
          context: { ...context, map, storage }
        });
  
        fireEvent.click(within(getByRole("region", { name: "My Places" }))
          .getByText("Create custom place"));
  
        fireEvent.click(getByRole("button", { name: "Select location" }));
  
        await waitFor(() => {
          expect(queryByRole("region", { name: "Favorites" })).not.toBeInTheDocument();
        });
  
        act(() => {
          captureLocation.mock.calls[0][0]({ lon: 0.0, lat: 0.0 });
        });
  
        await waitFor(() => {
          expect(getByRole("region", { name: "Favorites" })).toBeInTheDocument();
          expect(getByText("0.000000N, 0.000000E")).toBeInTheDocument();
        });
  
        const region = getByRole("region", { name: "My Places" });
  
        fireEvent.change(within(region)
          .getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
  
        act(() => {
          fireEvent.click(within(region).getByRole("button", { name: "Create" }))
        });
  
        await waitFor(() => {
          expect(within(region).getByRole("listitem", { name: "Place D" })).toBeInTheDocument();
          expect(within(region).getByText("Select location..."));
          expect(within(region).getByRole("textbox", { name: "Name" })).toHaveValue("");
        });
      }, 10_000);
  
      it("should preserve the state of `create place` dialog upon navigation", async () => {
        const { getByRole, getByText } = render(getProps(), getFavoritesOptions());
  
        fireEvent.click(getByText("Create custom place"));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place A" } });
  
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Search routes" }));
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Favorites" }));
  
        expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place A");
      });
  
      it("should preserve the state of collapsible regions upon navigation", async () => {
        const kinds = ["Directions", "Places", "Routes"];
  
        const { getByRole, queryByRole } = render(getProps(), getFavoritesOptions());
  
        kinds.forEach((kind) => {
          fireEvent.click(getByRole("button", { name: `My ${kind}` }));
        });
  
        await waitFor(() => {
          kinds.forEach((kind) => {
            expect(queryByRole("region", { name: `My ${kind}` })).not.toBeInTheDocument();
          });
        });
  
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Search routes" }));
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Favorites" }));
  
        kinds.forEach((kind) => {
          expect(queryByRole("region", { name: `My ${kind}` })).not.toBeInTheDocument();
        });
  
        kinds.forEach((kind) => {
          fireEvent.click(getByRole("button", { name: `My ${kind}` }));
        });
  
        await waitFor(() => {
          kinds.forEach((kind) => {
            expect(queryByRole("region", { name: `My ${kind}` })).toBeInTheDocument();
          });
        });
  
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Search routes" }));
        fireEvent.click(within(getByRole("navigation", { name: "Panels" })).getByRole("button", { name: "Favorites" }));
  
        kinds.forEach((kind) => {
          expect(queryByRole("region", { name: `My ${kind}` })).toBeInTheDocument();
        });
      }, 15_000);
    });

    describe("routes", () => {

      it("should allow the user to view routes and navigate back", () => {

        const { getByRole, getByText } = render(getProps(), getFavoritesOptions());

        ["A", "B", "C"].forEach((handle) => {
          fireEvent.click(within(getByRole("listitem", { name: `Route ${handle}` })).getByRole("button", { name: "Menu" }));
          fireEvent.click(getByRole("menuitem", { name: "View" }));

          expect(getByText(`Route ${handle}`)).toBeInTheDocument();
          expect(getByRole("list", { name: "Category filters" })).toBeInTheDocument();

          fireEvent.click(getByRole("button", { name: "Back" }));
          expect(getByRole("button", { name: "My Directions" })).toBeInTheDocument();
        });
      });

      it("should replace current sequence by points of a route ordered for modification", async () => {

        const { getByRole, queryAllByRole } = render(getProps(), {
          ...getFavoritesOptions(),
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true,
              routes: [["A", "1"], ["B", "2"], ["C", "3"]].map(([nameId, routeId]) => ({ ...getRoute(), name: `Route ${nameId}`, routeId }))
            },
            searchDirecs: {
              waypoints: [
                { ...getPlace(), name: "Place Y" }
              ]
            }
          }
        });

        fireEvent.click(within(getByRole("listitem", { name: "Route B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Modify" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));

        await waitFor(() => {
          expect(within(getByRole("list", { name: "Waypoints" })).queryAllByRole("listitem")).not.toHaveLength(0);
        });
        const places = queryAllByRole("listitem");

        ["Source S", "Place B", "Place A", "Place A", "Place C", "Place D", "Target T"]
          .forEach((name, i) => {
            expect(within(places[i]).getByText(name)).toBeInTheDocument();
          });
        expect(places).toHaveLength(7);
      });
    });
  });

  describe("search", () => {

    describe("direcs", () => {

      const getSearchDirecsOptions = () => ({
        ...getOptions(),
        routerProps: {
          initialEntries: ["/search/direcs"]
        }
      });

      it("should allow the user to select a point on the map", async () => {

        const map = new LeafletMap();
        const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();

        const { getByRole, getByText, queryByRole } = render(getProps(), {
          ...getSearchDirecsOptions(),
          context: { ...context, map }
        });

        fireEvent.click(getByRole("button", { name: "Select waypoint" }));
        fireEvent.click(getByRole("button", { name: "Select location" }));
        await waitFor(() => {
          expect(queryByRole("search", { name: "Directions" })).not.toBeInTheDocument();
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        act(() => {
          captureLocation.mock.calls[0][0]({ lat: 0.123456012, lon: 0.123456012 });
        });
        await waitFor(() => {
          expect(getByRole("search", { name: "Directions" })).toBeInTheDocument();
        });
        expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(getByText("0.123456N, 0.123456E")).toBeInTheDocument();
      });

      it("should allow the user to select a point from the store", async () => {
        const { getByRole, getByText, queryByRole } = render(getProps(), getSearchDirecsOptions());

        fireEvent.click(getByRole("button", { name: "Select waypoint" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(getByText("Place B")).toBeInTheDocument();
      });

      it("should synchronize name of a point with store if similar object is available", async () => {

        const { getByRole, queryByRole } = render(getProps(), getSearchDirecsOptions());

        // append

        fireEvent.click(getByRole("button", { name: "Select waypoint" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });

        // rename

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Edit" }));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search directions" }));
        await waitFor(() => {
          expect(getByRole("listitem", { name: "Place D" })).toBeInTheDocument();
        });

        // delete

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place D" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Delete" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Delete" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search directions" }));
        await waitFor(() => {
          expect(getByRole("listitem", { name: "Place B" })).toBeInTheDocument();
        });
      }, 20_000);

      it("should allow the user to search for directions visiting the sequence in order", async () => {

        const direcsRequestObject: UiPlace[] = ["A", "B", "C"].map((handle) => ({
          ...getPlace(),
          name: `Place ${handle}`
        }));

        jest.spyOn(smartwalkApi, "fetchSearchDirecs").mockResolvedValueOnce(Array(3).fill(undefined).map(() => ({
          waypoints: direcsRequestObject,
          name: "",
          path: getPath()
        })));

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            searchDirecs: {
              waypoints: direcsRequestObject
            }
          },
          routerProps: {
            initialEntries: ["/search/direcs"]
          }
        });

        act(() => {
          fireEvent.click(getByRole("button", { name: "Search" }));
        });
        await waitFor(() => {
          expect(getByText("Found a total of", { exact: false })).toHaveTextContent("Found a total of 3 directions.");
        });
        fireEvent.click(getByRole("button", { name: "Back" }));
        expect(getByRole("search", { name: "Directions" }));
      });

      it("should not redirect to the result if search fails", async () => {

        const direcsRequestObject: UiPlace[] = ["A", "B", "C"].map((handle) => ({
          ...getPlace(),
          name: `Place ${handle}`
        }));

        const alertSpy = jest.spyOn(window, "alert");
        jest.spyOn(smartwalkApi, "fetchSearchDirecs").mockRejectedValueOnce(new Error());

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            searchDirecs: {
              waypoints: direcsRequestObject
            }
          },
          routerProps: {
            initialEntries: ["/search/direcs"]
          }
        });

        act(() => {
          fireEvent.click(getByRole("button", { name: "Search" }));
        });
        await waitFor(() => {
          expect(getByRole("button", { name: "Search" })).toBeEnabled();
        });
        expect(alertSpy).toHaveBeenCalled();
      });
    });

    describe("places", () => {

      const getSearchPlacesOptions = () => ({
        ...getOptions(),
        routerProps: {
          initialEntries: ["/search/places"]
        }
      });

      it("should allow the user to select center on the map", async () => {
        const map = new LeafletMap();
        const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();

        const { getByRole, queryByRole } = render(getProps(), {
          ...getSearchPlacesOptions(),
          context: { ...context, map }
        });

        fireEvent.click(getByRole("button", { name: "Select center point" }));
        fireEvent.click(getByRole("button", { name: "Select location" }));
        await waitFor(() => {
          expect(queryByRole("search", { name: "Places" })).not.toBeInTheDocument();
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        act(() => {
          captureLocation.mock.calls[0][0]({ lat: 0.123456012, lon: 0.123456012 });
        });
        await waitFor(() => {
          expect(getByRole("search", { name: "Places" })).toBeInTheDocument();
        });
        const region = getByRole("region", { name: "Center point" });

        expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(within(region).getByText("0.123456N, 0.123456E")).toBeInTheDocument();
      });

      it("should allow the user to select center from the store", async () => {
        const { getByRole, queryByRole } = render(getProps(), getSearchPlacesOptions());

        fireEvent.click(getByRole("button", { name: "Select center point" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        const region = getByRole("region", { name: "Center point" });

        expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(within(region).getByText("Place B")).toBeInTheDocument();
      });

      it("should synchronize name of the center with store if similar object is available", async () => {

        const { getByRole, queryByRole } = render(getProps(), getSearchPlacesOptions());

        fireEvent.click(getByRole("button", { name: "Select center point" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });

        // rename

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Edit" }));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search places" }));
        expect(within(getByRole("region", { name: "Center point" })).getByText("Place D"));

        // delete

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place D" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Delete" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Delete" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search places" }));
        expect(within(getByRole("region", { name: "Center point" })).getByText("Place B"));
      }, 20_000);

      it("should allow the user to search for places around a center point", async () => {

        const placesRequestObject: PlacesRequest = {
          center: {
            ...getPlace(),
            name: "Center"
          },
          radius: 4.5,
          categories: [
            {
              ...getKeywordAdviceItem(),
              filters: {}
            }
          ]
        };

        jest.spyOn(smartwalkApi, "fetchSearchPlaces").mockResolvedValueOnce({
          ...placesRequestObject,
          places: ["A", "B", "C"].map((handle) => ({
            ...getPlace(),
            name: `Place ${handle}`,
            smartId: handle,
            categories: [0]
          }))
        });

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            searchPlaces: placesRequestObject as SearchPlacesState
          },
          routerProps: {
            initialEntries: ["/search/places"]
          }
        });

        act(() => {
          fireEvent.click(getByRole("button", { name: "Search" }));
        });
        await waitFor(() => {
          expect(getByText("Found a total of", { exact: false })).toBeInTheDocument();
        });
        expect(within(getByRole("list", { name: "Places found" })).getAllByRole("listitem")).toHaveLength(3);
        fireEvent.click(getByRole("button", { name: "Back" }));
        expect(getByRole("search", { name: "Places" }));
      });

      it("should not redirect to the result if search fails", async () => {

        const placesRequestObject: PlacesRequest = {
          center: {
            ...getPlace(),
            name: "Center"
          },
          radius: 4.5,
          categories: [
            {
              ...getKeywordAdviceItem(),
              filters: {}
            }
          ]
        };

        const alertSpy = jest.spyOn(window, "alert");
        jest.spyOn(smartwalkApi, "fetchSearchPlaces").mockRejectedValueOnce(new Error());

        const { getByRole } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            searchPlaces: placesRequestObject as SearchPlacesState
          },
          routerProps: {
            initialEntries: ["/search/places"]
          }
        });

        act(() => {
          fireEvent.click(getByRole("button", { name: "Search" }));
        });
        await waitFor(() => {
          expect(getByRole("button", { name: "Search" })).toBeEnabled();
        });
        expect(alertSpy).toHaveBeenCalled();
      });
    });

    describe("routes", () => {

      const getSearchRoutesOptions = () => ({
        ...getOptions(),
        routerProps: {
          initialEntries: ["/search/routes"]
        }
      });

      it("should allow the user to select source on the map", async () => {
        const map = new LeafletMap();
        const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();

        const { getByRole, queryByRole } = render(getProps(), {
          ...getSearchRoutesOptions(),
          context: { ...context, map }
        });

        fireEvent.click(getByRole("button", { name: "Select starting point" }));
        fireEvent.click(getByRole("button", { name: "Select location" }));
        await waitFor(() => {
          expect(queryByRole("search", { name: "Routes" })).not.toBeInTheDocument();
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        act(() => {
          captureLocation.mock.calls[0][0]({ lat: 0.123456012, lon: 0.123456012 });
        });
        await waitFor(() => {
          expect(getByRole("search", { name: "Routes" })).toBeInTheDocument();
        });
        const region = getByRole("region", { name: "Starting point" });

        expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(within(region).getByText("0.123456N, 0.123456E")).toBeInTheDocument();
      });

      it("should allow the user to select source from the store", async () => {
        const { getByRole, queryByRole } = render(getProps(), getSearchRoutesOptions());

        fireEvent.click(getByRole("button", { name: "Select starting point" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        const region = getByRole("region", { name: "Starting point" });

        expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(within(region).getByText("Place B")).toBeInTheDocument();
      });

      it("should synchronize name of the source with store if similar object is available", async () => {

        const { getByRole, queryByRole } = render(getProps(), getSearchRoutesOptions());

        fireEvent.click(getByRole("button", { name: "Select starting point" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });

        // rename

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Edit" }));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search routes" }));
        expect(within(getByRole("region", { name: "Starting point" })).getByText("Place D"));

        // delete

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place D" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Delete" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Delete" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search routes" }));
        expect(within(getByRole("region", { name: "Starting point" })).getByText("Place B"));
      }, 20_000);

      it("should allow the user to select target on the map", async () => {
        const map = new LeafletMap();
        const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();

        const { getByRole, queryByRole } = render(getProps(), {
          ...getSearchRoutesOptions(),
          context: { ...context, map }
        });

        fireEvent.click(getByRole("button", { name: "Select destination" }));
        fireEvent.click(getByRole("button", { name: "Select location" }));
        await waitFor(() => {
          expect(queryByRole("search", { name: "Routes" })).not.toBeInTheDocument();
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        act(() => {
          captureLocation.mock.calls[0][0]({ lat: 0.123456012, lon: 0.123456012 });
        });
        await waitFor(() => {
          expect(getByRole("search", { name: "Routes" })).toBeInTheDocument();
        });
        const region = getByRole("region", { name: "Destination" });

        expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(within(region).getByText("0.123456N, 0.123456E")).toBeInTheDocument();
      });

      it("should allow the user to select target from the store", async () => {
        const { getByRole, queryByRole } = render(getProps(), getSearchRoutesOptions());

        fireEvent.click(getByRole("button", { name: "Select destination" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });
        const region = getByRole("region", { name: "Destination" });

        expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
        expect(within(region).getByText("Place B")).toBeInTheDocument();
      });

      it("should synchronize name of the target with store if similar object is available", async () => {

        const { getByRole, queryByRole } = render(getProps(), getSearchRoutesOptions());

        fireEvent.click(getByRole("button", { name: "Select destination" }));
        fireEvent.click(getByRole("button", { name: "Open" }));
        fireEvent.click(getByRole("option", { name: "Place B" }));
        fireEvent.click(getByRole("button", { name: "Confirm" }));
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
        });

        // rename

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Edit" }));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place D" } });
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search routes" }));
        expect(within(getByRole("region", { name: "Destination" })).getByText("Place D"));

        // delete

        fireEvent.click(getByRole("button", { name: "Favorites" }));
        fireEvent.click(within(getByRole("listitem", { name: "Place D" })).getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Delete" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Delete" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Edit place" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Search routes" }));
        expect(within(getByRole("region", { name: "Destination" })).getByText("Place B"));
      }, 20_000);

      it("should allow the user to search for routes between source and target", async () => {

        const routesRequestObject: RoutesRequest = {
          source: {
            ...getPlace(),
            name: "Source"
          },
          target: {
            ...getPlace(),
            name: "Target"
          },
          maxDistance: 4.5,
          categories: [
            { ...getKeywordAdviceItem(), keyword: "castle", filters: {} },
            { ...getKeywordAdviceItem(), keyword: "museum", filters: {} }
          ],
          arrows: []
        };

        jest.spyOn(smartwalkApi, "fetchSearchRoutes").mockResolvedValueOnce(Array(3).fill(undefined).map(() => (getRoute())));

        const { getByRole, getByText } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            searchRoutes: routesRequestObject as SearchRoutesState
          },
          routerProps: {
            initialEntries: ["/search/routes"]
          }
        });

        act(() => {
          fireEvent.click(getByRole("button", { name: "Search" }));
        });
        await waitFor(() => {
          expect(getByText("Found a total of", { exact: false })).toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Back" }));
        expect(getByRole("search", { name: "Routes" }));
      });

      it("should not redirect to the result if search fails", async () => {

        const routesRequestObject: RoutesRequest = {
          source: {
            ...getPlace(),
            name: "Source"
          },
          target: {
            ...getPlace(),
            name: "Target"
          },
          maxDistance: 4.5,
          categories: [
            {
              ...getKeywordAdviceItem(),
              filters: {}
            }
          ],
          arrows: []
        };

        const alertSpy = jest.spyOn(window, "alert");
        jest.spyOn(smartwalkApi, "fetchSearchRoutes").mockRejectedValueOnce(new Error());

        const { getByRole } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show: true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            searchRoutes: routesRequestObject as SearchRoutesState
          },
          routerProps: {
            initialEntries: ["/search/routes"]
          }
        });

        act(() => {
          fireEvent.click(getByRole("button", { name: "Search" }));
        });
        await waitFor(() => {
          expect(getByRole("button", { name: "Search" })).toBeEnabled();
        });
        expect(alertSpy).toHaveBeenCalled();
      });
    });
  });

  describe("result", () => {

    describe("direcs", () => {

      it("should allow the user to create a local copy of a found direc", async () => {

        const { getByRole, queryByRole } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show:true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            resultDirecs: {
              ...initialResultDirecsState(),
              result: Array(3).fill(undefined).map(() => (getDirec()))
            }
          },
          routerProps: {
            initialEntries: [
              "/search/direcs", "/result/direcs"
            ]
          }
        });

        fireEvent.click(getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Save" }));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Direction A" } });
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Save direction" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Back" }));
        fireEvent.click(getByRole("button", { name: "Favorites" }));
        expect(within(getByRole("region", { name: "My Directions" })).getByText("Direction A")).toBeInTheDocument();
      });
    });

    describe("routes", () => {

      it("should allow the user to create a local copy of a found route", async () => {

        const { getByRole, queryByRole } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show:true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            resultRoutes: {
              result: Array(3).fill(undefined).map(() => (getRoute())),
              index: 0,
              categoryFilters: Array(5).fill(true)
            }
          },
          routerProps: {
            initialEntries: [
              "/favorites", "/result/routes"
            ]
          }
        });

        fireEvent.click(getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Save" }));
        fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Route A" } });
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog", { name: "Save route" })).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Back" }));
        expect(within(getByRole("region", { name: "My Routes" })).getByText("Route A")).toBeInTheDocument();
      });

      it("should allow the user to copy a route as a direction sequence and modify (with redirect)", async () => {

        const { getByRole } = render(getProps(), {
          preloadedState: {
            panel: {
              ...initialPanelState(),
              show:true
            },
            favorites: {
              ...initialFavoritesState(),
              loaded: true
            },
            resultRoutes: {
              result: Array(3).fill(undefined).map(() => (getRoute())),
              index: 0,
              categoryFilters: Array(5).fill(true)
            }
          },
          routerProps: {
            initialEntries: [
              "/result/routes"
            ]
          }
        });

        fireEvent.click(getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Modify" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Confirm" }));
        });
        await waitFor(() => {
          expect(within(getByRole("list", { name: "Waypoints" })).queryAllByRole("listitem")).toHaveLength(7);
        });
      });
    });
  });

  describe("entity", () => {

    describe("places", () => {

      type T = ReturnType<typeof renderWithProviders>;

      const getEntityPlacesOptions = (termLocation: string): AppRenderOptions => ({
        preloadedState: {
          panel: {
            ...initialPanelState(),
            show: true
          },
          favorites: {
            ...initialFavoritesState(),
            loaded: true
          },
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: [
              {
                ...getPlace(),
                name: "Modern bridge"
              }
            ]
          }
        },
        routerProps: {
          initialEntries: [
            termLocation, "/entity/places/D"
          ]
        },
        context: {
          ...context,
          smart: {
            entityPlaces: new Map([["D", {
              ...getExtendedPlace(),
              smartId: "D"
            }]]),
            adviceKeywords: new Map()
          }
        }
      });

      it("should allow the user to create a local copy of a place", async () => {
        let renderObject: T;

        act(() => {
          renderObject = render(getProps(), getEntityPlacesOptions("/favorites"));
        })

        await waitFor(() => {
          expect(renderObject.getByRole("button", { name: "Menu" }));
        });

        const { getByRole, queryByRole } = renderObject!;

        fireEvent.click(getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Save" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Save" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog")).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Back" }));
        expect(within(getByRole("region", { name: "My Places" })).getByText("Medieval castle"));
      });

      it("should allow the user to append a place to the current direction sequence", async () => {
        let renderObject: T;

        act(() => {
          renderObject = render(getProps(), getEntityPlacesOptions("/search/direcs"));
        })

        await waitFor(() => {
          expect(renderObject.getByRole("button", { name: "Menu" }));
        });

        const { getByRole, queryByRole } = renderObject!;

        fireEvent.click(getByRole("button", { name: "Menu" }));
        fireEvent.click(getByRole("menuitem", { name: "Append" }));
        act(() => {
          fireEvent.click(getByRole("button", { name: "Confirm" }));
        });
        await waitFor(() => {
          expect(queryByRole("dialog")).not.toBeInTheDocument();
        });
        fireEvent.click(getByRole("button", { name: "Back" }));

        await waitFor(() => {
          const places = within(getByRole("list", { name: "Waypoints" }))
            .queryAllByRole("listitem");

          ["Modern bridge", "Medieval castle"].forEach((name, i) => {
            expect(within(places[i]).getByText(name)).toBeInTheDocument();
          });
        });
      });
    });
  });

  describe("not found", () => {

    describe("fallback", () => {

      test("should appear for an unknown url paths", () => {
        const { getByText } = render(getProps(), {
          ...getOptions(),
          routerProps: {
            initialEntries: ["/unknown"]
          }
        });
        expect(getByText("Oops! Unknown address...")).toBeInTheDocument();
      })
    })
  });

});
