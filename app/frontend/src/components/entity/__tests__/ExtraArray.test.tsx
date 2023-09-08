import { render as rtlRender } from "@testing-library/react";
import ExtraArray, { type ExtraArrayProps } from "../ExtraArray";

const getDefault = (): ExtraArrayProps => ({
  array: ["1", "2", "3"],
  label: "cuisine"
});

function render(props = getDefault()) {
  return rtlRender(<ExtraArray {...props} />);
}

describe("<ExtraArray />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("formatted label", () => {
    const { getByText } = render();
    expect(getByText("Cuisine:")).toBeInTheDocument();
  });

  test("list of items", () => {
    const { getByText } = render();
    expect(getByText("1, 2, 3")).toBeInTheDocument();
  });
});
