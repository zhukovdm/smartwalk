import { fireEvent, screen } from "@testing-library/react";
import {
  FAVORITES_ADDR,
  SEARCH_DIRECS_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../../../domain/routing";
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
    render(0);
    fireEvent.click(screen.getByTestId("smartwalk-search-routes-button"));
    expect(mockUseNavigate).toHaveBeenCalledWith(SEARCH_ROUTES_ADDR);
  });

  test("places button redirects to places panel", () => {
    render(1);
    fireEvent.click(screen.getByTestId("smartwalk-search-places-button"));
    expect(mockUseNavigate).toHaveBeenCalledWith(SEARCH_PLACES_ADDR);
  });

  test("direcs button redirects to direcs panel", () => {
    render(2);
    fireEvent.click(screen.getByTestId("smartwalk-search-direcs-button"));
    expect(mockUseNavigate).toHaveBeenCalledWith(SEARCH_DIRECS_ADDR);
  });

  test("favors button redirects to favors panel", () => {
    render(3);
    fireEvent.click(screen.getByTestId("smartwalk-search-favors-button"));
    expect(mockUseNavigate).toHaveBeenCalledWith(FAVORITES_ADDR);
  });
});
