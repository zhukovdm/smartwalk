import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {
  RenderResult,
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { store } from "../../../features/store";
import BackCloseBar from "../BackCloseBar";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

function render(): RenderResult {
  return rtlRender(
    <Provider store={store}>
      <MemoryRouter>
        <BackCloseBar />
      </MemoryRouter>
    </Provider>
  );
}

describe("<BackCloseBar />", () => {

  test("back makes one step back", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(mockUseNavigate).toHaveBeenCalledWith(-1);
  });

  it("should render hide button", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Hide panel" })).toBeInTheDocument();
  })
});
