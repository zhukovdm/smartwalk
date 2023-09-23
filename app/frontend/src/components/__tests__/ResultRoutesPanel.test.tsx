import { getRoute } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import type { UiRoute } from "../../domain/types";
import { initialFavoritesState } from "../../features/favoritesSlice";
import { initialResultRoutesState } from "../../features/resultRoutesSlice";
import ResultRoutesPanel from "../ResultRoutesPanel";

const getOptions = (routes: UiRoute[]): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
    resultRoutes: {
      ...initialResultRoutesState(),
      result: routes,
      categoryFilters: Array(routes[0]?.categories.length ?? 0).fill(true)
    }
  }
});

function render(options: AppRenderOptions = getOptions([])) {
  return renderWithProviders(<ResultRoutesPanel />, options);
}

describe("<ResultRoutesPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  /**
   * `Save` functionality is tested in the PanelDrawer.test.tsx
   */
  ///

  it("should render loading if favorites are not loaded yet", () => {

    const { getByRole } = render({});
    expect(getByRole("progressbar")).toBeVisible();
  });

  it("should render alert if the list of routes is empty", () => {

    const { getByRole } = render();
    expect(getByRole("alert")).toBeVisible();
  });

  it("should render the content if at least one place is found", () => {

    const { getByText } = render(getOptions(Array(3).fill(undefined).map(() => (getRoute()))));
    expect(getByText("Found a total of", { exact: false })).toBeInTheDocument();
  });
});
