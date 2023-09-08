import { getDirec } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import MyDirecsList, { MyDirecsListProps } from "../MyDirecsList";

const getDefault = (): MyDirecsListProps => ({
  "aria-labelledby": "smartwalk-my-direcs-head"
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<MyDirecsList {...props} />, options);
}

describe("MyDirecsList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("empty state renders stub", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Search directions" })).toBeInTheDocument();
  });

  test("non-trivial state renders list", () => {
    const { getAllByRole, getByRole } = render(getDefault(), {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          direcs: [
            { ...getDirec(), name: "Direction A", direcId: "1" },
            { ...getDirec(), name: "Direction B", direcId: "2" },
            { ...getDirec(), name: "Direction C", direcId: "3" }
          ]
        }
      }
    });
    expect(getByRole("list")).toBeInTheDocument();
    expect(getAllByRole("listitem").length).toBe(3);
  });
});
