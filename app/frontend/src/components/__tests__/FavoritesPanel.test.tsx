import { within } from "@testing-library/react";
import { initialFavoritesState } from "../../features/favoritesSlice";
import { getDirec, getPlace, getRoute } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import FavoritesPanel, {
  type FavoritesPanelProps
} from "../FavoritesPanel";

const getDefault = (): FavoritesPanelProps => ({
  loaded: true,
  loadedRatio: 0.5
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<FavoritesPanel {...props} />, options);
}

describe("<FavoritesPanel />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("render stub", () => {
    const { getByText } = render({ ...getDefault(), loaded: false });
    expect(getByText("50%")).toBeInTheDocument();
  });

  test("render empty panel", () => {
    const { getByRole } = render();
    expect(getByRole("alert")).toBeInTheDocument();

    expect(within(getByRole("region", { name: "My Directions" }))
      .getByRole("button", { name: "Search directions" })).toBeInTheDocument();

    expect(within(getByRole("region", { name: "My Places" }))
      .getByRole("button", { name: "Search places" })).toBeInTheDocument();

    expect(within(getByRole("region", { name: "My Routes" }))
      .getByRole("button", { name: "Search routes" })).toBeInTheDocument();
  });

  test("render panel with items", () => {
    const { getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          direcs: [{ ...getDirec(), name: "Direc A", direcId: "1" }],
          places: [{ ...getPlace(), name: "Place B", placeId: "2" }],
          routes: [{ ...getRoute(), name: "Route C", routeId: "3" }]
        }
      }
    });
    expect(getByRole("listitem", { name: "Direc A" })).toBeInTheDocument();
    expect(getByRole("listitem", { name: "Place B" })).toBeInTheDocument();
    expect(getByRole("listitem", { name: "Route C" })).toBeInTheDocument();
  });
});
