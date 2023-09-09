import { render as rtlRender } from "@testing-library/react";
import CategoryFilterList, {
  type CategoryFilterListProps
} from "../CategoryFilterList";

const getProps = (): CategoryFilterListProps => ({
  categories: [
    {
      keyword: "castle",
      filters: {}
    },
    {
      keyword: "museum",
      filters: {}
    },
  ],
  filterList: [
    true,
    false
  ],
  found: jest.fn(),
  onToggle: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<CategoryFilterList {...props} />);
}

describe("<CategoryFilterList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("role and name", () => {
    const { getByRole } = render();
    expect(getByRole("list", { name: "Category filters" })).toBeInTheDocument();
  });

  test("item generation", () => {
    const { getAllByRole } = render();
    expect(getAllByRole("listitem").length).toEqual(2);
  });
});
