import type { StoredRoute } from "../../domain/types";
import { getRoute } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import { initialViewerState } from "../../features/viewerSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";
import ViewerRoutePanel from "../ViewerRoutePanel";

const getProps = (): {} => ({});

const getOptions = (route: StoredRoute | undefined): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
    viewer: {
      ...initialViewerState(),
      route
    }
  }
});

function render(props = getProps(), options: AppRenderOptions = getOptions(undefined)) {
  return renderWithProviders(<ViewerRoutePanel {...props} />, options);
}

describe("<ViewerRoutePanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should render loading if favorites are not loaded yet", () => {

    const { getByRole } = render(getProps(), {});
    expect(getByRole("progressbar")).toBeVisible();
  });

  it("should render alert if no route is provided", () => {

    const { getByRole } = render();
    expect(getByRole("alert")).toBeVisible();
  });

  it("should render content if a route is provided", () => {

    const { getByText } = render(getProps(), getOptions({
      ...getRoute(),
      routeId: "1",
      name: "Route A"
    }));

    expect(getByText("Route A")).toBeVisible();
  });
});
