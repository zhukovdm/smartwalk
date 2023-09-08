import { getRoute } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import {
  initialFavoritesState
} from "../../../features/favoritesSlice";
import MyRoutesList, { MyRoutesListProps } from "../MyRoutesList";

const getDefault = (): MyRoutesListProps => ({
  "aria-labelledby": "smartwalk-my-routes-head"
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<MyRoutesList {...props} />, options);
}

describe("MyRoutesList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("empty state renders stub", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Search routes" })).toBeInTheDocument();
  });

  test("non-trivial state renders list", () => {
    const { getAllByRole, getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          routes: [
            { ...getRoute(), routeId: "1" },
            { ...getRoute(), routeId: "2" },
            { ...getRoute(), routeId: "3" }
          ]
        }
      }
    });
    expect(getByRole("list")).toBeInTheDocument();
    expect(getAllByRole("listitem").length).toBe(3);
  });
});
