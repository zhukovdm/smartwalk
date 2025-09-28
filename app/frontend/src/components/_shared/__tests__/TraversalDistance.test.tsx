import {
  render as rtlRender
} from "@testing-library/react";
import TraversalDistance, {
  type TraversalDistanceProps
} from "../TraversalDistance";

const getDefault = (): TraversalDistanceProps => ({
  distance: 1.234,
  exceedsMaxDistance: false
});

function render(props = getDefault()) {
  return rtlRender(<TraversalDistance {...props} />);
}

describe("<TraversalDistance />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("rounding", () => {
    const { getByText, queryByText } = render();
    expect(getByText("1.23")).toBeInTheDocument();
    expect(queryByText("1.234")).not.toBeInTheDocument();
  })
});
