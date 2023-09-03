import {
  StoreRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyPlacesList, { MyPlacesListProps } from "../MyPlacesList";
import { StoredPlace } from "../../../domain/types";

const getDefault = (): MyPlacesListProps => ({
  "aria-labelledby": "smartwalk-my-direcs-head"
});

const getStoredPlace = (placeId: string, name: string): StoredPlace => ({
  placeId: placeId,
  name: name,
  location: { lon: 0.0, lat: 0.0 },
  keywords: ["a"],
  categories: []
});

function render(props = getDefault(), options: StoreRenderOptions = {}) {
  return renderWithProviders(<MyPlacesList {...props} />, options);
}

describe("MyPlacesList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("empty state renders stub", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Search places" })).toBeInTheDocument();
  });

  test("non-trivial state renders list", () => {
    const { getAllByRole, getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: [
            getStoredPlace("1", "Place A"),
            getStoredPlace("2", "Place B"),
            getStoredPlace("3", "Place C")
          ]
        }
      }
    });
    expect(getByRole("list")).toBeInTheDocument();
    expect(getAllByRole("listitem").length).toBe(3);
  });
});
