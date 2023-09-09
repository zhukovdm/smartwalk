import { fireEvent } from "@testing-library/react";
import {
    AppRenderOptions,
    renderWithProviders
} from "../../../utils/testUtils";
import { initialPanelState } from "../../../features/panelSlice";
import LogoCloseBar from "../LogoCloseBar";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<LogoCloseBar />, options);
}

describe("<LoadingStubWithLabel />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("hiding", () => {
    const { store, getByRole } = render({
      preloadedState: {
        panel: {
          ...initialPanelState(),
          show: true
        }
      }
    });
    fireEvent.click(getByRole("button"));
    expect(store.getState().panel.show).toEqual(false);
  });
});
