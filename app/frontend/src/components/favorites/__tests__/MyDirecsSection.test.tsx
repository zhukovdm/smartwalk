import { fireEvent, waitFor } from "@testing-library/react";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyDirecsSection from "../MyDirecsSection";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<MyDirecsSection />, options);
}

describe("MyDirecsSection />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("renders region", () => {
    const { getByRole } = render();
    expect(getByRole("region", { name: "My Directions" })).toBeInTheDocument();
  });
  
  test("collapse", async () => {
    const { getByRole, queryByRole } = render();
    fireEvent.click(getByRole("button", { name: "My Directions" }));
    await waitFor(() => {
      expect(queryByRole("region", { name: "My Directions" })).not.toBeInTheDocument();
    });
  });

  test("expand", () => {
    const { getByRole } = render({
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          direcsExpanded: false
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "My Directions" }));
    expect(getByRole("region", { name: "My Directions" })).toBeInTheDocument();
  });
});
