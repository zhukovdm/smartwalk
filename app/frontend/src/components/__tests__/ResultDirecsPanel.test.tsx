import { getDirec } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import type { UiDirec } from "../../domain/types";
import { initialFavoritesState } from "../../features/favoritesSlice";
import { initialResultDirecsState } from "../../features/resultDirecsSlice";
import ResultDirecsPanel from "../ResultDirecsPanel";

const getOptions = (direcs: UiDirec[]): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    },
    resultDirecs: {
      ...initialResultDirecsState(),
      result: direcs
    }
  }
});

function render(options: AppRenderOptions = getOptions([])) {
  return renderWithProviders(<ResultDirecsPanel />, options);
}

describe("<ResultDirecsPanel />", () => {

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

  it("should render alert if the list of direcs is empty", () => {

    const { getByRole } = render();
    expect(getByRole("alert")).toBeVisible();
  });

  it("should render the content if at least one direc is found", () => {

    const { getByText } = render(getOptions(Array(3).fill(undefined).map(() => (getDirec()))));
    expect(getByText("Found a total of", { exact: false })).toBeInTheDocument();
  });
});
