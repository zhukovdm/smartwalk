import {
  fireEvent
} from "@testing-library/react";
import {
  FAVORITES_ADDR,
  SEARCH_DIRECS_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../../../utils/routing";
import { renderWithProviders } from "../../../utils/testUtils";
import PanelSelector from "../PanelSelector";

const mockUseNavigate = jest.fn();

const rrdModule = "react-router-dom";

jest.mock(rrdModule, () => ({
  ...jest.requireActual(rrdModule),
  useNavigate: () => mockUseNavigate
}));

function render(panel: number) {
  return renderWithProviders(<PanelSelector panel={panel} />, {});
}

describe("<PanelSelector />", () => {

  test("routes button redirects to routes panel", () => {
    const { getByRole } = render(0);
    fireEvent.click(getByRole("button", { name: "Search routes" }));
    expect(mockUseNavigate).toHaveBeenCalledWith(SEARCH_ROUTES_ADDR);
  });

  test("places button redirects to places panel", () => {
    const { getByRole } = render(1);
    fireEvent.click(getByRole("button", { name: "Search places" }));
    expect(mockUseNavigate).toHaveBeenCalledWith(SEARCH_PLACES_ADDR);
  });

  test("direcs button redirects to direcs panel", () => {
    const { getByRole } = render(2);
    fireEvent.click(getByRole("button", { name: "Search directions" }));
    expect(mockUseNavigate).toHaveBeenCalledWith(SEARCH_DIRECS_ADDR);
  });

  test("favors button redirects to favors panel", () => {
    const { getByRole } = render(3);
    fireEvent.click(getByRole("button", { name: "Favorites" }));
    expect(mockUseNavigate).toHaveBeenCalledWith(FAVORITES_ADDR);
  });
});
