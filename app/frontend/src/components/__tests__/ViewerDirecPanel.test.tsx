import type { StoredDirec } from "../../domain/types";
import { getDirec } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import { initialViewerState } from "../../features/viewerSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";
import ViewerDirecPanel from "../ViewerDirecPanel";

const getProps = (): {} => ({});

const getOptions = (direc: StoredDirec | undefined): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
    viewer: {
      ...initialViewerState(),
      direc
    }
  }
});

function render(props = getProps(), options: AppRenderOptions = getOptions(undefined)) {
  return renderWithProviders(<ViewerDirecPanel {...props} />, options);
}

describe("<ViewerDirecPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should render loading if favorites are not loaded yet", () => {

    const { getByRole } = render(getProps(), {});
    expect(getByRole("progressbar")).toBeVisible();
  });

  it("should render alert if no direc is provided", () => {

    const { getByRole } = render();
    expect(getByRole("alert")).toBeVisible();
  });

  it("should render content if a direc is provided", () => {

    const { getByText } = render(getProps(), getOptions({
      ...getDirec(),
      direcId: "1",
      name: "Direction A"
    }));

    expect(getByText("Direction A")).toBeVisible();
  });
});
