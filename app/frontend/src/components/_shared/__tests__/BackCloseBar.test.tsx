import { fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils";
import BackCloseBar from "../BackCloseBar";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

function render() {
  return renderWithProviders(<BackCloseBar />, {});
}

describe("<BackCloseBar />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

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
