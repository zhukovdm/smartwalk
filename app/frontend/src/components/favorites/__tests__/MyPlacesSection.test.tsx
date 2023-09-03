import { fireEvent, waitFor } from "@testing-library/react";
import {
  StoreRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyPlacesSection from "../MyPlacesSection";

function render(options: StoreRenderOptions = {}) {
  return renderWithProviders(<MyPlacesSection />, options);
}

describe("MyPlacesSection />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("renders region", () => {
    const { getByRole } = render();
    expect(getByRole("region", { name: "My Places" })).toBeInTheDocument();
  });
  
  test("collapse", async () => {
    const { getByRole, queryByRole } = render();
    fireEvent.click(getByRole("button", { name: "My Places" }));
    await waitFor(() => {
      expect(queryByRole("region", { name: "My Places" })).not.toBeInTheDocument();
    });
  });

  test("expand", () => {
    const { getByRole } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          placesExpanded: false
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "My Places" }));
    expect(getByRole("region", { name: "My Places" })).toBeInTheDocument();
  });
});
