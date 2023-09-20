import { act, fireEvent, waitFor, within } from "@testing-library/react";
import { getPlace } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import InmemStorage from "../../utils/inmemStorage";
import { LeafletMap } from "../../utils/leaflet";
import { context } from "../../features/context";
import { initialPanelState } from "../../features/panelSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";
import { initialSearchRoutesState } from "../../features/searchRoutesSlice";
import PanelDrawer from "../PanelDrawer";

const getProps = (): {} => ({});

const getOptions = (): AppRenderOptions => ({
  preloadedState: {
    panel: {
      ...initialPanelState(),
      show: true
    },
    favorites: {
      ...initialFavoritesState(),
      places: [["A", "1"], ["B", "2"], ["C", "3"]].map(([suffix, placeId]) => ({
        ...getPlace(),
        name: `Place ${suffix}`,
        placeId
      }))
    }
  }
})

function render(props = getProps(), options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<PanelDrawer {...props} />, options);
}

describe("<PanelDrawer />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("search routes", () => {

    const getSearchRoutesOptions = () => ({
      ...getOptions(),
      routerProps: {
        initialEntries: ["/search/routes"]
      }
    });

    describe("source box", () => {

      describe("dialog", () => {

        test("source button opens select dialog", () => {
          const { getByRole } = render();
          fireEvent.click(getByRole("button", { name: "Select starting point" }));
          expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
        });
  
        test("source label opens select dialog", () => {
          const { getByRole, getByText } = render();
          fireEvent.click(getByText("Select starting point..."));
          expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
        });
  
        it("should allow to add user-defined location", async () => {
          const map = new LeafletMap();
          const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();
  
          const { getByRole, queryByRole } = render(getProps(), {
            ...getSearchRoutesOptions(),
            context: {
              ...context, map
            }
          });
  
          fireEvent.click(getByRole("button", { name: "Select starting point" }));
          fireEvent.click(getByRole("button", { name: "Select location" }));
          await waitFor(() => {
            expect(queryByRole("search", { name: "Routes" })).not.toBeInTheDocument();
            expect(queryByRole("dialog", { name: "Select point" })).not.toBeInTheDocument();
          });
          act(() => {
            captureLocation.mock.calls[0][0]({ lat: 0.123456012, lon: 0.123456012 });
          })
          await waitFor(() => {
            expect(getByRole("search", { name: "Routes" })).toBeInTheDocument();
          });
          const region = getByRole("region", { name: "Starting point" });
  
          expect(within(region).getByRole("button", { name: "Fly to" })).toBeInTheDocument();
          expect(within(region).getByText("0.123456N, 0.123456E")).toBeInTheDocument();
        });
  
        it("should allow to add location from the storage", async () => {
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
      });

      describe("name", () => {

        it("should use name from store if a place is available (by placeId), and restore old if deleted", async () => {
          const storage = new InmemStorage();
          const { getByRole, queryByRole } = render(getProps(), {
            preloadedState: {
              panel: {
                ...initialPanelState(),
                show: true
              },
              favorites: {
                ...initialFavoritesState(),
                loaded: true,
                places: [
                  {
                    ...getPlace(),
                    name: "Place B",
                    placeId: "1"
                  }
                ]
              },
              searchRoutes: {
                ...initialSearchRoutesState(),
                source: {
                  ...getPlace(),
                  name: "Place A",
                  placeId: "1"
                }
              }
            },
            context: { ...context, storage }
          });

          expect(within(getByRole("region", { name: "Starting point" }))
            .getByText("Place B")).toBeVisible();

          fireEvent.click(getByRole("button", { name: "Favorites" }));

          fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
          fireEvent.click(getByRole("menuitem", { name: "Delete" }));
          act(() => {
            fireEvent.click(getByRole("button", { name: "Delete" }));
          });
          await waitFor(() => {
            expect(queryByRole("dialog", { name: "Delete place" })).not.toBeInTheDocument();
          });
          fireEvent.click(within(getByRole("navigation", { name: "Panels" }))
            .getByRole("button", { name: "Search routes" }));

          expect(within(getByRole("region", { name: "Starting point" }))
            .getByText("Place A")).toBeInTheDocument();
        });

        it("should use name from store if a place is available (by smartId), and restore old if deleted", async () => {

          /*
           * In the current implementation, this use-case is impossible
           * because a source can be either a user-defined place with no `Id`,
           * or a favorite place with a `placeId`.
           */

          const storage = new InmemStorage();
          const { getByRole, queryByRole } = render(getProps(), {
            preloadedState: {
              panel: {
                ...initialPanelState(),
                show: true
              },
              favorites: {
                ...initialFavoritesState(),
                loaded: true,
                places: [
                  {
                    ...getPlace(),
                    name: "Place B",
                    placeId: "2", // !== "1"
                    smartId: "A"
                  }
                ]
              },
              searchRoutes: {
                ...initialSearchRoutesState(),
                target: {
                  ...getPlace(),
                  name: "Place A",
                  placeId: "1", // !== "2"
                  smartId: "A"
                }
              }
            },
            context: { ...context, storage }
          });

          expect(within(getByRole("region", { name: "Destination" }))
            .getByText("Place B")).toBeVisible();

          fireEvent.click(getByRole("button", { name: "Favorites" }));

          fireEvent.click(within(getByRole("listitem", { name: "Place B" })).getByRole("button", { name: "Menu" }));
          fireEvent.click(getByRole("menuitem", { name: "Delete" }));
          act(() => {
            fireEvent.click(getByRole("button", { name: "Delete" }));
          });
          await waitFor(() => {
            expect(queryByRole("dialog", { name: "Delete place" })).not.toBeInTheDocument();
          });
          fireEvent.click(within(getByRole("navigation", { name: "Panels" }))
            .getByRole("button", { name: "Search routes" }));

          expect(within(getByRole("region", { name: "Destination" }))
            .getByText("Place A")).toBeInTheDocument();
        });
      });

      describe("state", () => {

        it("should preserve configured state upon Hide", () => {
          expect(false).toBeTruthy();
        });

        it("should preserve configured state upon Navigate", () => {
          expect(false).toBeTruthy();
        });
      })
    });

    describe("target box", () => {

    });

    describe("state", () => {

      it("should preserve state upon hiding the panel", () => {

      });

      it("should preserve state upon navigating to a different panel", () => {

      });
    })
  });

  describe("search places", () => {

    const getSearchPlacesOptions = () => ({
      routerProps: {
        initialEntries: ["/search/places"]
      }
    });

    describe("source box", () => {


    });

    describe("source box", () => {

      
    });

    describe("swap button", () => {

      
    });

    describe("distance slider", () => {

      
    });

    
  });

  describe("search direcs", () => {



    describe("sequence", () => {

    });

    describe("reverse button", () => {

      
    });

    describe("clear button", () => {

      
    });

    describe("search button", () => {

      
    });
  });
});
