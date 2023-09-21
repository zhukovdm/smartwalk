import type { StoredPlace } from "../../domain/types";
import { getPlace } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import { initialViewerState } from "../../features/viewerSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";
import ViewerPlacePanel from "../ViewerPlacePanel";

const getProps = (): {} => ({});

const getOptions = (place: StoredPlace | undefined): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
    viewer: {
      ...initialViewerState(),
      place
    }
  }
});

function render(props = getProps(), options: AppRenderOptions = getOptions(undefined)) {
  return renderWithProviders(<ViewerPlacePanel {...props} />, options);
}

describe("<ViewerPlacePanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should render alert if no place is provided", () => {

    const { getByRole } = render();
    expect(getByRole("alert")).toBeVisible();
  });

  it("should render content if a direc is provided", () => {

    const { getByText } = render(getProps(), getOptions({
      ...getPlace(),
      placeId: "1",
      name: "Place A"
    }));

    expect(getByText("Place A")).toBeVisible();
  });
});
