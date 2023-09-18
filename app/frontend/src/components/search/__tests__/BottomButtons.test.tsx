import { fireEvent } from "@testing-library/react";
import { initialPanelState } from "../../../features/panelSlice";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import BottomButtons, {
  type BottomButtonsProps
} from "../BottomButtons";

const getProps = (): BottomButtonsProps => ({
  disabled: false,
  onClear: jest.fn(),
  onSearch: jest.fn()
})

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<BottomButtons {...props} />, options);
}

describe("<BottomButtons />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render buttons", () => {
    const { getByRole } = render();
    ["Clear", "Search"].forEach((name) => {
      expect(getByRole("button", { name })).toBeInTheDocument();
    });
  })

  test("`disabled` disable only search button", () => {
    const { getByRole } = render({
      ...getProps(),
      disabled: true
    });
    expect(getByRole("button", { name: "Search" })).toHaveAttribute("disabled");
    expect(getByRole("button", { name: "Clear" })).not.toHaveAttribute("disabled");
  });

  test("panel block disable both buttons", () => {
    const { getByRole } = render(getProps(), {
      preloadedState: {
        panel: {
          ...initialPanelState(),
          block: true
        }
      }
    });
    ["Clear", "Search"].forEach((name) => {
      expect(getByRole("button", { name })).toHaveAttribute("disabled");
    });
  });

  test("callback gets called upon clicking on Clear", () => {
    const onClear = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      onClear: onClear,
    });
    fireEvent.click(getByRole("button", { name: "Clear" }));
    expect(onClear).toHaveBeenCalled();
  });

  test("callback gets called upon clicking on Search", () => {
    const onSearch = jest.fn();

    const { getByRole } = render({
      ...getProps(),
      onSearch: onSearch
    });
    fireEvent.click(getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalled();
  });
});
