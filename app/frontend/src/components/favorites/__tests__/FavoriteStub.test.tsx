import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { withRouter } from "../../../utils/testUtils";
import FavoriteStub, { FavoriteStubProps } from "../FavoriteStub";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

const getDefault = (): FavoriteStubProps => ({
  what: "place",
  icon: jest.fn(),
  link: "/search/places"
});

function render(props = getDefault()) {
  return rtlRender(withRouter(<FavoriteStub {...props} />));
}

describe("<FavoriteStub />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("button navigates to a search panel", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Search places" }));
    expect(mockUseNavigate).toHaveBeenCalledWith("/search/places");
  });

  test("not found message", () => {
    const { getByText } = render();
    expect(getByText("No places found")).toBeInTheDocument();
  });
});
