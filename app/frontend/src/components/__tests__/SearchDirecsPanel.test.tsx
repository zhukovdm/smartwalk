import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import SearchDirecsPanel from "../SearchDirecsPanel";

const getProps = (): {} => ({});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<SearchDirecsPanel {...props} />, options);
}

describe("<SearchDirecsPanel />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });
});
