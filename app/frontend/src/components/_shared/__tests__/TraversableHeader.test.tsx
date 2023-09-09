import { render as rtlRender } from "@testing-library/react";
import TraversableHeader, {
  type TraversableHeaderProps
} from "../TraversableHeader";

const getDefault = (): TraversableHeaderProps => ({
  name: "Place A"
});

function render(props = getDefault()) {
  return rtlRender(<TraversableHeader {...props} />);
}

describe("<TraversableHeader />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("pass name", () => {
    const { getByText } = render();
    expect(getByText("Place A")).toBeInTheDocument();
  });
});
