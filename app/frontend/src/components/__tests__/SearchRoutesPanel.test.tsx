import { cleanup, fireEvent } from "@testing-library/react";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import SearchRoutesPanel from "../SearchRoutesPanel";
import { initialSearchRoutesState } from "../../features/searchRoutesSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<SearchRoutesPanel />, options);
}

describe("<SearchRoutesPanel />", () => {

  beforeEach(cleanup);

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("source", () => {

    test("source button opens select dialog", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Select starting point" }));
      expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
    });

    test("source description opens select dialog", () => {
      const { getByRole, getByText } = render();
      fireEvent.click(getByText("Select starting point..."));
      expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
    });

    test("simple source is rendered", () => {
      const name = "0.000000N, 0.000000E";
      const { getByRole, getByText } = render({
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              name: name,
              location: {
                lon: 0.0,
                lat: 0.0
              },
              keywords: [],
              categories: []
            }
          }
        }
      });
      expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
      expect(getByText(name)).toBeInTheDocument();
      expect(getByRole("button", { name: "Remove point" })).toBeInTheDocument();
    });

    it("should remove source upon clicking on the remove button", () => {
      const { getByRole, getByText } = render({
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              name: "",
              location: {
                lon: 0.0,
                lat: 0.0
              },
              keywords: [],
              categories: []
            }
          }
        }
      });
      fireEvent.click(getByRole("button", { name: "Remove point" }));
      expect(getByRole("button", { name: "Select starting point" })).toBeInTheDocument();
      expect(getByText("Select starting point...")).toBeInTheDocument();
    });

    it("should replace source name by favorite with the same placeId", () => {
      const { getByText } = render({
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              placeId: "1",
              name: "Place A",
              location: {
                lon: 0.0,
                lat: 0.0
              },
              keywords: [],
              categories: []
            }
          },
          favorites: {
            ...initialFavoritesState(),
            places: [
              {
                placeId: "1",
                name: "Place B",
                location: {
                  lon: 0.0,
                  lat: 0.0
                },
                keywords: [],
                categories: []
              }
            ]
          }
        }
      });
      expect(getByText("Place B")).toBeInTheDocument();
    });

    it("should render source name as a link in the presence of smartId", () => {
      const name = "Place A";
      const { getByRole } = render({
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              smartId: "1",
              name: name,
              location: {
                lon: 0.0,
                lat: 0.0
              },
              keywords: [],
              categories: []
            }
          }
        }
      });
      expect(getByRole("link", { name: name })).toBeInTheDocument();
    });
  });

  describe("target", () => {

    test("target button opens select dialog", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Select destination" }));
      expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
    });

    test("target description opens select dialog", () => {
      const { getByRole, getByText } = render();

      fireEvent.click(getByText("Select destination..."));
      expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
    });
  });

  describe("swap", () => {

    test("swap does nothing when both slots are empty", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Swap points" }));
      expect(getByRole("button", { name: "Select starting point" })).toBeInTheDocument();
      expect(getByRole("button", { name: "Select destination" })).toBeInTheDocument();
    });

    it("should move source to the target free slot", () => {
      const name = "Place A";
      const { getByRole, getByText } = render({
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              name: name,
              location: {
                lon: 0.0,
                lat: 0.0
              },
              keywords: [],
              categories: []
            }
          }
        }
      });
      fireEvent.click(getByRole("button", { name: "Swap points" }));
      expect(getByRole("button", { name: "Select starting point" })).toBeInTheDocument();
      expect(getByText("Select starting point...")).toBeInTheDocument();
      expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
      expect(getByText("Place A")).toBeInTheDocument();
    });

    it("should swap source and target", () => {
      const nameS = "Place A";
      const nameT = "Place B";
      const source = {
        name: nameS,
        location: {
          lon: 0.0,
          lat: 0.0
        },
        keywords: [],
        categories: []
      };
      const target = {
        name: nameT,
        location: {
          lon: 0.0,
          lat: 0.0
        },
        keywords: [],
        categories: []
      }
      const { getByRole, store } = render({
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: source,
            target: target,
            
          }
        }
      });
      fireEvent.click(getByRole("button", { name: "Swap points" }));
      const { source: s, target: t } = store.getState().searchRoutes;

      expect(s).toBe(target);
      expect(t).toBe(source);
      
    });
  });

  describe("categories", () => { });

  describe("precedence", () => { });

  describe("search", () => { });
});
