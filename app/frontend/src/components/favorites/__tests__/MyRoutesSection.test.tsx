import { fireEvent, waitFor } from "@testing-library/react";
import {
  StoreRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyRoutesSection from "../MyRoutesSection";

function render(options: StoreRenderOptions = {}) {
  return renderWithProviders(<MyRoutesSection />, options);
}

describe("MyRoutesSection />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("renders region", () => {
    const { getByRole } = render();
    expect(getByRole("region", { name: "My Routes" })).toBeInTheDocument();
  });
  
  test("collapse", async () => {
    const { getByRole, queryByRole } = render();
    fireEvent.click(getByRole("button", { name: "My Routes" }));
    await waitFor(() => {
      expect(queryByRole("region", { name: "My Routes" })).not.toBeInTheDocument();
    });
  });

  test("expand", () => {
    const { getByRole } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          routesExpanded: false
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "My Routes" }));
    expect(getByRole("region", { name: "My Routes" })).toBeInTheDocument();
  });
});
