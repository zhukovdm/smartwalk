import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import NotFoundPanel from "../NotFoundPanel";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<NotFoundPanel />, options);
}

describe("<NotFoundPanel />", () => {

  /**
   * `Fallback` is tested in the PanelDrawer.test.tsx
   */
  ///

  test("render", () => {
    expect(render()).toBeTruthy();
  });
});
