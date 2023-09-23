import { getPlace } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import type { Place } from "../../domain/types";
import {
  initialFavoritesState
} from "../../features/favoritesSlice";
import ResultPlacesPanel from "../ResultPlacesPanel";

const getOptions = (places: Place[]): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
    resultPlaces: {
      result: {
        center: {
          ...getPlace(),
          name: "Center"
        },
        radius: 3.1,
        categories: [
          { keyword: "bridge", filters: {} },
          { keyword: "castle", filters: {} },
          { keyword: "museum", filters: {} }
        ],
        places
      },
      filters: [true, true],
      page: 0,
      pageSize: 10
    }
  }
});

function render(options: AppRenderOptions = getOptions([])) {
  return renderWithProviders(<ResultPlacesPanel />, options);
}

describe("<ResultPlacesPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should render loading if favorites are not loaded yet", () => {

    const { getByRole } = render({});
    expect(getByRole("progressbar")).toBeVisible();
  });

  it("should render alert if the list of places is empty", () => {

    const { getByRole } = render();
    expect(getByRole("alert")).toBeVisible();
  });

  it("should render the content if at least one place is found", () => {

    const { getByText } = render(getOptions(["A", "B", "C"].map((handle, index) => ({
      ...getPlace(),
      name: `Place ${handle}`,
      smartId: handle,
      categories: [index],
    }))));
    expect(getByText("Found a total of", { exact: false })).toBeInTheDocument();
  });
});
