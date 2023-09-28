import { render as rtlRender } from "@testing-library/react";
import ArrowList, { type ArrowListProps } from "../ArrowList";

const getProps = (): ArrowListProps => ({
  arrows: [
    { fr: 0, to: 1 },
    { fr: 1, to: 2 }
  ]
});

function render(props = getProps()) {
  return rtlRender(<ArrowList {...props} />);
}

describe("<ArrowList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("role and name", () => {
    const { getByRole } = render();
    expect(getByRole("list", { name: "Arrows" })).toBeInTheDocument();
  });

  test("item generation", () => {
    const { getAllByRole } = render();
    expect(getAllByRole("listitem").length).toEqual(2);
  });
});
