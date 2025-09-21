import { act, waitFor } from "@testing-library/react";
import * as smartwalkApi from "../../utils/smartwalk";
import { getExtendedPlace } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import type { ExtendedPlace } from "../../domain/types";
import { context } from "../../features/context";
import { initialFavoritesState } from "../../features/favoritesSlice";
import EntityPlacePanel from "../EntityPlacePanel";

global.alert = jest.fn();

jest.mock("axios");

const getOptions = (entityPlaces?: Map<string, ExtendedPlace>): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
  },
  routerProps: {
    initialEntries: [
      "/entity/places/A"
    ]
  },
  context: {
    ...context,
    cache: {
      entityPlaces: entityPlaces ?? new Map(),
      adviceKeywords: new Map(),
      searchedPlaces: new Map(),
    }
  }
});

function render(options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<EntityPlacePanel />, options);
}

describe("<EntityPlacePanel />", () => {

  type T = ReturnType<typeof renderWithProviders>;

  const getPlaces = () => (new Map<string, ExtendedPlace>(
    ["A", "B", "C"].map((smartId) => ([smartId, {
      ...getExtendedPlace(),
      smartId
    }]))));
  
  test("render", async () => {
    let renderObject: T;

    act(() => {
      renderObject = render(getOptions(getPlaces()));
    });

    await waitFor(() => {
      expect(renderObject.container).toBeTruthy();
    })
  });

  it("should show progress if place is not loaded yet", async () => {
    let renderObject: T;

    jest.spyOn(smartwalkApi, "fetchEntityPlaces").mockImplementation(
      () => {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
          return getExtendedPlace();
        });
      });
  
    act(() => {
      renderObject = render({
        preloadedState: {
          favorites: {
            ...initialFavoritesState(),
            loaded: true
          }
        }
      });
    });

    await waitFor(() => {
      expect(renderObject.getByRole("progressbar")).toBeInTheDocument();
    })
  });

  it("should show progress if favorites are not loaded yet", async () => {
    let renderObject: T;

    act(() => {
      renderObject = render({
        preloadedState: {
          favorites: initialFavoritesState()
        }
      });
    })

    await waitFor(() => {
      expect(renderObject.getByRole("progressbar")).toBeInTheDocument();
    })
  });

  it("should show place once loaded from the server", async () => {
    let renderObject: T;

    jest.spyOn(smartwalkApi, "fetchEntityPlaces").mockResolvedValueOnce({
      ...getExtendedPlace(),
      smartId: "A"
    });

    act(() => {
      renderObject = render({
        preloadedState: {
          favorites: {
            ...initialFavoritesState(),
            loaded: true
          }
        }
      });
    });

    await waitFor(() => {
      expect(renderObject.getByText("Medieval castle")).toBeInTheDocument();
    });
  });

  it("should show alert if no place was loaded from the server", async () => {
    let renderObject: T;

    jest.spyOn(smartwalkApi, "fetchEntityPlaces").mockResolvedValueOnce(undefined);

    act(() => {
      renderObject = render({
        preloadedState: {
          favorites: {
            ...initialFavoritesState(),
            loaded: true
          }
        }
      });
    });

    await waitFor(() => {
      expect(renderObject.getByRole("alert")).toBeInTheDocument();
    });
  });
});
