import {
  RenderResult,
  render as rtlRender
} from "@testing-library/react";
import CategoryFilterList from "../CategoryFilterList";

function render(): RenderResult {

  const categories = [
    {
      keyword: "castle",
      filters: {}
    },
    {
      keyword: "museum",
      filters: {}
    },
  ];

  const filterList = [
    true,
    false
  ];

  return rtlRender(
    <CategoryFilterList
      categories={categories}
      filterList={filterList}
      found={jest.fn()}
      onToggle={jest.fn()}
    />
  )
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
