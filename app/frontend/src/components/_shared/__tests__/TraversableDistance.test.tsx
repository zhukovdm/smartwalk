import { render as rtlRender } from "@testing-library/react";
import TraversableDistance, {
  type TraversableDistanceProps
} from "../TraversableDistance";

const getDefault = (): TraversableDistanceProps => ({
  distance: 1.234
});

function render(props = getDefault()) {
  return rtlRender(<TraversableDistance {...props} />);
}

describe("<TraversableDistance />", () => {

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
